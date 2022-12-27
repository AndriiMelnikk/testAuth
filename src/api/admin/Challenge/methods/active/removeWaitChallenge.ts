import { Request, Response } from 'express';
import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';

import supabase from '../../../../supabase';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import { StatusCodes } from '../../../../type/statusCode';

const removeWaitChallenge = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.query;

    useCheckValue(challengeId, TypeData.string, 'challengeId');

    const { error } = await supabase.from('activeChallengeCompany').delete().eq('id', challengeId);

    if (error) {
      return useResponse().Error(res, error.message, StatusCodes.BadRequest, WhoseError.server);
    }

    useResponse().Json(res, StatusCodes.Create, { message: 'Remove active challenge' });
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default removeWaitChallenge;
