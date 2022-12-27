import { Request, Response } from 'express';

import supabase from '../../../supabase';

import useResponse, { WhoseError } from '../../../hooks/useResponse';
import useCheckValue, { TypeData } from '../../../hooks/useCheckValue';
import useAddTags from '../../Tags/hooks/challenges/useAddTags';

import { StatusCodes } from '../../../type/statusCode';
import { putChallenge } from '../type';
import { ActiveChallenge, StatusChallenge } from '../../../type/type';

const createChallenges = async (req: Request, res: Response) => {
  try {
    const { name, description, prize, type, period, condition, tags }: putChallenge = req.body;

    useCheckValue(name, TypeData.string, 'name');
    useCheckValue(description, TypeData.string, 'description');
    useCheckValue(prize, TypeData.boolean, 'prize');
    useCheckValue(type, TypeData.includes, 'type', ActiveChallenge);
    useCheckValue(period, TypeData.number, 'period');
    useCheckValue(condition, TypeData.string, 'condition');

    const { data: create, error: createError } = await supabase
      .from('challenges')
      .insert({
        idAuthor: 'admin',
        name,
        description,
        status: StatusChallenge.active,
        prize,
        type,
        period,
        condition,
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

export default createChallenges;
