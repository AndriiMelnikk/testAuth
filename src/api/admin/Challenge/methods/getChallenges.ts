import { Request, Response } from 'express';

import supabase from '../../../supabase';

import useCheckValue, { TypeData } from '../../../hooks/useCheckValue';
import useRange from '../../../hooks/useRange';
import useGetParticipant from '../../../hooks/methods/participant/useGetParticipantArray';
import useResponse, { WhoseError } from '../../../hooks/useResponse';

import { StatusCodes } from '../../../type/statusCode';
import { AuthorChallenges } from '../type';
import { StatusChallenge } from '../../../type/type';
import useGetTags from '../../Tags/hooks/challenges/useGetTags';

const getChallenges = async (req: Request, res: Response) => {
  try {
    const {
      pages = 1,
      pageTags = 1,
      search = '',
      author = AuthorChallenges.all,
      status = StatusChallenge.active,
    }: {
      pages?: number;
      pageTags?: number;
      search?: string;
      author?: AuthorChallenges;
      status?: StatusChallenge;
    } = req.query;

    useCheckValue(pages, TypeData.number, 'Params.pages');
    useCheckValue(author, TypeData.string, 'Params.challenges');
    useCheckValue(search, TypeData.string, 'Params.search');
    useCheckValue(status, TypeData.includes, 'Params.status', StatusChallenge);

    const { rangeFrom, rangeTo } = useRange(pages);
    const { rangeFrom: rangeFromTag, rangeTo: rangeToTag } = useRange(pageTags);
    const arrayChallenges: any[] = [];

    switch (author) {
      case AuthorChallenges.all: {
        const { data: challenges, error: errorChallenges } = await supabase
          .from('challenges')
          .select()
          .ilike('name', `%${search}%`)
          .eq('status', status)
          .range(rangeFrom, rangeTo);

        if (errorChallenges)
          useResponse().Error(res, errorChallenges.message, StatusCodes.BadRequest, WhoseError.server);

        if (challenges) arrayChallenges.push(...challenges);
        break;
      }
      case AuthorChallenges.admin: {
        const { data: challenges, error: errorChallenges } = await supabase
          .from('challenges')
          .select()
          .eq('idAuthor', AuthorChallenges.admin)
          .ilike('name', `%${search}%`)
          .eq('status', status)
          .range(rangeFrom, rangeTo);

        if (errorChallenges) {
          useResponse().Error(res, errorChallenges.message, StatusCodes.BadRequest, WhoseError.server);
        }
        if (challenges) arrayChallenges.push(...challenges);

        break;
      }
      default: {
        const { data: users, error: errorUsers } = await supabase
          .from('users')
          .select('userId')
          .eq('companyId', author);
        if (users)
          for (const company of users) {
            const { data: challenges, error: errorChallenges } = await supabase
              .from('challenges')
              .select()
              .eq('status', status)
              .eq('idAuthor', company.userId);

            if (errorChallenges) {
              useResponse().Error(res, errorChallenges.message, StatusCodes.BadRequest, WhoseError.server);
            }

            if (challenges) {
              arrayChallenges.push(...challenges);
            }
          }

        if (errorUsers) {
          useResponse().Error(res, errorUsers.message, StatusCodes.BadRequest, WhoseError.server);
        }
        break;
      }
    }

    const arrayChallengesWithTags: any = [];

    for (const challengeIs of arrayChallenges) {
      const participant = await useGetParticipant(challengeIs.participant);
      const tags = await useGetTags(challengeIs.id, rangeFromTag, rangeToTag);

      arrayChallengesWithTags.push({ ...challengeIs, participant, tags });
    }

    useResponse().Array(res, StatusCodes.Success, arrayChallengesWithTags);
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default getChallenges;
