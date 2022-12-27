import { Request, Response } from 'express';
import { PostgrestResponse } from '@supabase/supabase-js';

import supabase from '../../../../supabase';

import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import updateTags from '../../../../hooks/methods/tag/challenge/useUpdateTags';

import { StatusCodes } from '../../../../type/statusCode';
import { putChallengeTemplate } from '../../type';
import { ActiveChallenge, StatusChallenge } from '../../../../type/type';

const PutChallenge = async (req: Request, res: Response) => {
  try {
    const update: Partial<putChallengeTemplate> = req.body;

    const userId = req.cookies.userId;

    update.id === undefined && useResponse().Error(res, '"id" is undefined', StatusCodes.BadRequest, WhoseError.web);

    CheckValues(update);

    const challenge: PostgrestResponse<undefined> = await supabase
      .from('challenges')
      .update({ ...update })
      .eq('id', update.id)
      .eq('idAuthor', userId);

    if (update.tags && update.id) {
      await updateTags(update.tags, update.id);
      delete update.tags;
    }

    if (!challenge.error) {
      useResponse().Json(res, StatusCodes.Accepted, { message: 'update challenge' });
    } else if (challenge.status === StatusCodes.NotFound) {
      useResponse().Error(res, 'Not found challenge', StatusCodes.BadRequest, WhoseError.web);
    } else {
      useResponse().Error(res, challenge.error.message, StatusCodes.BadRequest, WhoseError.server);
    }
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default PutChallenge;

const CheckValues = (update: Partial<putChallengeTemplate>) => {
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

  if (update.tags && update.id) {
    for (const tag of update.tags) {
      tag.status === 'add'
        ? useCheckValue([tag], TypeData.obj, 'tags: add', {}, ['id'])
        : useCheckValue([tag], TypeData.obj, 'tags: remove', {}, ['idChallengeTag']);
    }
  } else {
    delete update.tags;
  }
};
