import { Request, Response } from 'express';

import supabase from '../../../../supabase';

import { StatusCodes } from '../../../../type/statusCode';
import { StatusChallenge } from '../../../../type/type';

import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useGetUserInCompany from '../../../../hooks/useGetUserInCompany';

const updateChallengeActive = async (req: Request, res: Response) => {
  try {
    const {
      id,
      status = StatusChallenge.active,
      userId,
    }: { id?: string; status?: StatusChallenge; userId: string } = req.body;

    id !== undefined
      ? useCheckValue(id, TypeData.string, 'id')
      : useResponse().Error(res, '"id" is undefined', StatusCodes.BadRequest, WhoseError.web);

    status !== undefined
      ? useCheckValue(status, TypeData.includes, 'status', StatusChallenge)
      : useResponse().Error(res, '"status" is undefined', StatusCodes.BadRequest, WhoseError.web);

    userId !== undefined
      ? useCheckValue(userId, TypeData.string, 'userId')
      : useResponse().Error(res, '"userId" is undefined', StatusCodes.BadRequest, WhoseError.web);

    const company = await useGetUserInCompany(userId);

    const activeChallengeCompany = await supabase
      .from('activeChallengeCompany')
      .update({ status: status })
      .eq('challengeId', id)
      .eq('companyId', company.companyId)
      .select();

    if (activeChallengeCompany.error)
      useResponse().Error(res, activeChallengeCompany.error.message, StatusCodes.BadRequest, WhoseError.web);

    useResponse().Json(res, StatusCodes.Accepted, { message: 'updateChallengeActive' });
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default updateChallengeActive;
