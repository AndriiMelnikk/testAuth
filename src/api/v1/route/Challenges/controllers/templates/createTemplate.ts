import { Request, Response } from 'express';
import { PostgrestResponse } from '@supabase/supabase-js';

import supabase from '../../../../../supabase';

import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';
import useAddTags from '../../../../hooks/controller/tag/challenge/useAddTags';

import { QueryCreate, RoleCreate } from './type';
import { StatusCodes } from '../../../../../type/statusCode';
import { ActiveChallenge, StatusChallenge } from '../../../../../type/type';
import { Roles } from '../../../../type/role';
import { SchemaChallenges } from '../../../../../type/schema';

const CreateTemplate = async (req: Request, res: Response, { userId, role }: { userId: string; role: Roles }) => {
  try {
    const { name, description, prize, type, period, condition, img, tags }: QueryCreate = req.body;

    CheckValues({ name, description, prize, type, period, condition, img, tags });

    const create: PostgrestResponse<SchemaChallenges> = await Supabase(role, {
      userId,
      name,
      description,
      prize,
      type,
      period,
      condition,
      img,
    });

    if (create.error) return useResponse().Error(res, create.error.code, StatusCodes.BadRequest, WhoseError.server);

    for (const tag of tags) {
      useAddTags(tag, create.data[0].id);
    }

    useResponse().Json(res, StatusCodes.Create, { message: 'Created challenge' });
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default CreateTemplate;

const Supabase: RoleCreate = async (role, { userId, name, description, prize, type, period, condition, img }) => {
  const idAuthor = role !== Roles.ADMIN ? userId : 'admin';

  return await supabase
    .from('challenges')
    .insert({
      idAuthor,
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
};

const CheckValues = ({ name, description, prize, type, period, condition, img, tags }: Partial<QueryCreate>) => {
  useCheckValue(name, TypeData.string, 'name');
  useCheckValue(description, TypeData.string, 'description');
  useCheckValue(type, TypeData.includes, 'type', ActiveChallenge);
  useCheckValue(prize, TypeData.boolean, 'prize');
  useCheckValue(period, TypeData.number, 'period');
  useCheckValue(condition, TypeData.string, 'condition');
  useCheckValue(img, TypeData.string, 'img');

  if (tags)
    for (const tag of tags) {
      useCheckValue([tag], TypeData.obj, 'tags: add', {}, ['id']);
    }
};
