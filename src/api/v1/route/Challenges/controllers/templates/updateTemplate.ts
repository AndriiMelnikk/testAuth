import { Request, Response } from 'express';
import { PostgrestResponse } from '@supabase/supabase-js';

import supabase from '../../../../../supabase';

import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import updateTags from '../../../../hooks/controller/tag/challenge/useUpdateTags';

import { StatusCodes } from '../../../../../type/statusCode';
import { QueryPut, RoleUpdate } from './type';
import { ActiveChallenge, StatusChallenge } from '../../../../../type/type';
import { Roles } from '../../../../type/role';

const UpdateTemplate = async (req: Request, res: Response, { userId, role }: { userId: string; role: Roles }) => {
  try {
    const update: Partial<QueryPut> = req.body;

    if (update.id === undefined) {
      return useResponse().Error(res, '"id" is undefined', StatusCodes.BadRequest, WhoseError.web);
    }

    CheckValues(update);

    if (update.tags) {
      await updateTags(update.tags, update.id);
      delete update.tags;
    }

    const updated: PostgrestResponse<any> = await Supabase(role, { ...update, userId });

    if (!updated.error) return useResponse().Json(res, StatusCodes.Accepted, { message: 'update challenge' });

    if (updated.status === StatusCodes.NotFound)
      return useResponse().Error(res, 'Not found template challenge', StatusCodes.BadRequest, WhoseError.web);

    useResponse().Error(res, updated.error.message, StatusCodes.BadRequest, WhoseError.server);
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default UpdateTemplate;

const Supabase: RoleUpdate = async (role: any, update) => {
  const idAuthor = role !== Roles.ADMIN ? update.userId : 'admin';

  delete update.userId;

  return await supabase.from('challenges').update(update).eq('id', update.id).eq('idAuthor', idAuthor);
};

const CheckValues = (update: Partial<QueryPut>) => {
  update.id !== undefined && useCheckValue(update.id, TypeData.string, 'id (idChallenge)');

  update.tags !== undefined && useCheckValue(update.tags, TypeData.obj, 'tags', {}, ['status']);

  update.name !== undefined ? useCheckValue(update.name, TypeData.string, 'name') : delete update.name;

  update.description !== undefined
    ? useCheckValue(update.description, TypeData.string, 'description')
    : delete update.description;

  update.status !== undefined
    ? useCheckValue(update.status, TypeData.includes, 'status', StatusChallenge)
    : delete update.status;

  update.prize !== undefined ? useCheckValue(update.prize, TypeData.boolean, 'prize') : delete update.prize;

  update.type !== undefined
    ? useCheckValue(update.type, TypeData.includes, 'type', ActiveChallenge)
    : delete update.type;

  update.period !== undefined ? useCheckValue(update.period, TypeData.number, 'period') : delete update.period;

  update.condition !== undefined
    ? useCheckValue(update.condition, TypeData.string, 'condition')
    : delete update.condition;

  if (update.tags) {
    for (const tag of update.tags) {
      tag.status === 'add'
        ? useCheckValue([tag], TypeData.obj, 'tags: add', {}, ['id'])
        : useCheckValue([tag], TypeData.obj, 'tags: remove', {}, ['idChallengeTag']);
    }
  } else {
    delete update.tags;
  }
};
