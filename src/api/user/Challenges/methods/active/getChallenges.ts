import { Request, Response } from 'express';

import ImgPath from '../../../../img/config';
import supabase from '../../../../supabase';

import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';
import useRange from '../../../../hooks/useRange';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useGetUserInCompany from '../../../../hooks/useGetUserInCompany';
import useGetLengthParticipant from '../../../../hooks/methods/participant/useGetLengthParticipant';

import { StatusCodes } from '../../../../type/statusCode';
import { getActiveChallenges, StatusChallengeActive } from '../../type';

const getChallengesActive = async (req: Request, res: Response) => {
  try {
    const { page = 1, status = null }: getActiveChallenges = req.query;

    const userId = req.cookies.userId;

    const { rangeFrom, rangeTo } = useRange(page);

    const challengesCompany = [];

    CheckValues({ status, page });

    const company = await useGetUserInCompany(userId);

    const { data: challengesActive, error: errorChallengesActive } = await supabase
      .from('activeChallengeCompany')
      .select('id, companyId, challengeId, dateStart, dateEnd, prizes, status')
      .eq('companyId', company.companyId)
      .eq(status ? 'status' : '', status)
      .range(rangeFrom, rangeTo);

    if (challengesActive)
      for (const challenge of challengesActive) {
        const { data: challenges, error: errorChallenges } = await supabase
          .from('challenges')
          .select(' name, description, period, condition, img')
          .match({ id: challenge.challengeId })
          .single();

        if (errorChallenges) {
          useResponse().Error(res, errorChallenges.message, StatusCodes.BadRequest, WhoseError.server);
        }

        const participantLength = await useGetLengthParticipant(challenge?.id);

        challengesCompany.push({
          id: challenge.id,
          challengeId: challenge.challengeId,
          ...challenges,
          img: ImgPath.UserChallengeTemplate + challenges?.img,
          dateStart: challenge.dateStart,
          dateEnd: challenge.dateEnd,
          prize: challenge.prizes,
          status: challenge.status,
          participants: participantLength,
        });
      }

    if (errorChallengesActive)
      useResponse().Error(res, errorChallengesActive.message, StatusCodes.BadRequest, WhoseError.server);

    useResponse().Array(res, StatusCodes.Success, challengesCompany);
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default getChallengesActive;

const CheckValues = ({ status, page }: getActiveChallenges) => {
  if (status) useCheckValue(status, TypeData.includes, 'Params.status', StatusChallengeActive);
  useCheckValue(page, TypeData.number, 'Params.page');
};
