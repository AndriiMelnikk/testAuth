import { Request, Response } from 'express';
import { PostgrestResponse } from '@supabase/supabase-js';

import supabase from '../../../supabase';

import useCheckValue, { TypeData } from '../../../hooks/useCheckValue';
import useResponse, { WhoseError } from '../../../hooks/useResponse';
import updatePresenceTags from '../../Tags/hooks/challenges/updatePresenceTags';

import { StatusCodes } from '../../../type/statusCode';
import { putChallenge } from '../type';
import { ActiveChallenge, StatusChallenge } from '../../../type/type';

const putChallenge = async (req: Request, res: Response) => {
  const update: Partial<putChallenge> = req.body;

  try {
    update.id !== undefined
      ? useCheckValue(update.id, TypeData.string, 'userId')
      : useResponse().Error(res, '"id" is undefined', StatusCodes.BadRequest, WhoseError.web);

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

    if (update.tags !== undefined && update.id !== undefined) {
      useCheckValue(update.tags, TypeData.obj, 'tags', {}, ['id']);
      updatePresenceTags(update.tags, update.id);

      delete update.tags;
    } else {
      delete update.tags;
    }

    update.period !== undefined ? useCheckValue(update.period, TypeData.number, 'period') : delete update.period;

    update.condition !== undefined
      ? useCheckValue(update.condition, TypeData.string, 'condition')
      : delete update.condition;

    const challenge: PostgrestResponse<undefined> = await supabase
      .from('challenges')
      .update({ ...update })
      .eq('id', update.id)
      .eq('idAuthor', 'admin');

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

export default putChallenge;
