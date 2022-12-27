import { Request, Response } from 'express';

import supabase from '../../../../supabase';

import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';
import useAddTags from '../../../../hooks/methods/tag/challenge/useAddTags';

import { StatusCodes } from '../../../../type/statusCode';
import { ActiveChallenge, StatusChallenge } from '../../../../type/type';
import { createChallengeTemplate } from '../../type';

const CreateChallenges = async (req: Request, res: Response) => {
  try {
    const { name, description, prize, type, period, condition, img, tags }: createChallengeTemplate = req.body;

    CheckValues({ name, description, prize, type, period, condition, img, tags });

    const userId = req.cookies.userId;

    const { data: create, error: createError } = await supabase
      .from('challenges')
      .insert({
        idAuthor: userId,
        name,
        description,
        status: StatusChallenge.active,
        prize,
        type,
        period,
        condition,
        img,
      })
      .select();

    if (createError) useResponse().Error(res, createError.code, StatusCodes.BadRequest, WhoseError.server);

    if (create && tags) {
      for (const tag of tags) {
        useAddTags(tag, create[0].id);
      }
    }

    useResponse().Json(res, StatusCodes.Create, { message: 'Created challenge' });
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default CreateChallenges;

const CheckValues = ({ name, description, prize, type, period, condition, img, tags }: any) => {
  useCheckValue(name, TypeData.string, 'name');
  useCheckValue(description, TypeData.string, 'description');
  useCheckValue(type, TypeData.includes, 'type', ActiveChallenge);
  useCheckValue(prize, TypeData.boolean, 'prize');
  useCheckValue(period, TypeData.number, 'period');
  useCheckValue(condition, TypeData.string, 'condition');
  useCheckValue(img, TypeData.string, 'img');

  for (const tag of tags) {
    useCheckValue([tag], TypeData.obj, 'tags: add', {}, ['id']);
  }
};
