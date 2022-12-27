import { Request, Response } from 'express';

import ImgPath from '../../../../img/config';
import supabase from '../../../../supabase';

import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useGetTags from '../../../../hooks/methods/tag/challenge/useGetTags';
import useGetLengthTags from '../../../../hooks/methods/tag/challenge/useGetLengthTags';
import useGetParticipant from '../../../../hooks/methods/participant/useGetParticipant';
import useGetLengthParticipant from '../../../../hooks/methods/participant/useGetLengthParticipant';

import { StatusCodes } from '../../../../type/statusCode';
import { getActiveChallenge } from '../../type';

const getChallengesActive = async (req: Request, res: Response) => {
  try {
    const { id }: getActiveChallenge = req.query;

    const userId = req.cookies.userId;

    const challenges = await supabase
      .from('activeChallengeCompany')
      .select('id,created_at, dateStart, dateEnd, prizes, status, challenges(*)')
      .eq('id', id)
      .eq('challenges.idAuthor', userId)
      .limit(1);

    if (challenges.error || !challenges.data) {
      useResponse().Error(res, challenges.error.message, StatusCodes.BadRequest, WhoseError.server);
    } else {
      const challengeRes = challenges.data[0];

      const tags = await useGetTags(challengeRes.challenges.id);
      const tagsLength = await useGetLengthTags(challengeRes.challenges.id);
      const participant = await await useGetParticipant(challengeRes.id);
      const participantLength = await useGetLengthParticipant(challengeRes.id);

      const challengeOne = {
        ...challengeRes.challenges,
        ...challengeRes,
        tags,
        tagsLength,
        participant,
        participantLength,
        idTemplate: challengeRes.challenges.id,
        statusTemplate: challengeRes.challenges.status,
        created_at_template: challengeRes.challenges.created_at,
      };

      delete challengeOne.challenges;

      useResponse().Send(res, StatusCodes.Success, challengeOne);
    }
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default getChallengesActive;
