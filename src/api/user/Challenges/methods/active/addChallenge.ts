import { Request, Response } from 'express';
import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';

import supabase from '../../../../supabase';

import { StatusCodes } from '../../../../type/statusCode';
import { addChallengesActive } from '../../type';
import { StatusChallenge } from '../../../../type/type';

import useGetUserInCompany from '../../../../hooks/useGetUserInCompany';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';

const addChallengeActive = async (req: Request, res: Response) => {
  try {
    const { userId, challengeId, dateStart, prizes }: addChallengesActive = req.body;

    useCheckValue(userId, TypeData.string, 'userId');
    useCheckValue(challengeId, TypeData.string, 'challengeId');
    useCheckValue(dateStart, TypeData.date, 'dateStart');
    useCheckValue(prizes, TypeData.string, 'prizes');

    const company = await useGetUserInCompany(userId);

    const create = await supabase.from('activeChallengeCompany').insert({
      companyId: company.companyId,
      challengeId,
      dateStart,
      dateEnd: dateStart,
      prizes,
      status: StatusChallenge.active,
    });

    if (create.error) {
      useResponse().Error(res, create.error.message, StatusCodes.BadRequest, WhoseError.server);
    }

    useResponse().Json(res, StatusCodes.Create, { message: 'Added active challenge' });
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default addChallengeActive;
