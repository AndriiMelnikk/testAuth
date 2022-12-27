/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';

import supabase from '../../../../supabase';

import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';
import useRange from '../../../../hooks/useRange';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useGetTag from '../../../../hooks/methods/participant/useGetParticipantArray';
import useGetTagChallenge from '../../../../hooks/methods/tag/challenge/useGetLengthTags';

import { StatusCodes } from '../../../../type/statusCode';
import { StatusChallenge } from '../../../../type/type';
import { SortActiveChallenges } from '../../type';

const searchChallengesActive = async (req: Request, res: Response) => {
  try {
    const {
      pages = 1,
      pageTags = 1,
      status = StatusChallenge.active,
      search = '1',
      sort = SortActiveChallenges.dateStart,
    }: {
      pages?: number;
      pageTags?: number;
      status?: StatusChallenge;
      search?: string;
      sort?: SortActiveChallenges;
    } = req.query;

    useCheckValue(status, TypeData.includes, 'Params.status', StatusChallenge);
    useCheckValue(sort, TypeData.includes, 'Params.sort', SortActiveChallenges);
    useCheckValue(pages, TypeData.number, 'Params.pages');
    useCheckValue(search, TypeData.string, 'Params.search');

    const { rangeFrom, rangeTo } = useRange(pages);
    const { rangeFrom: rangeFromTag, rangeTo: rangeToTag } = useRange(pageTags);

    const challengesActive = await supabase
      .from('activeChallengeCompany')
      .select(
        `dateStart, dateEnd, id, prizes, challenges!inner(id, name, description, period, participant), company(name)`,
      )
      .ilike('challenges.name', `%${search}%`)
      .eq('status', status)
      .order(sort, { foreignTable: sort === SortActiveChallenges.name ? 'challenges' : '', ascending: true })
      .range(rangeFrom, rangeTo);

    if (challengesActive.error) {
      return useResponse().Error(res, challengesActive.error.message, StatusCodes.BadRequest, WhoseError.server);
    }

    const arrayChallengesWithTags: any = [];

    for (const challengeIs of challengesActive.data) {
      // @ts-ignore
      const participant = await useGetTag(challengeIs.challenges?.participant);
      // @ts-ignore
      const tags = await useGetTagChallenge(challengeIs.challenges?.id, rangeFromTag, rangeToTag);

      arrayChallengesWithTags.push({ ...challengeIs, participant, tags });
    }

    useResponse().Array(res, StatusCodes.Success, arrayChallengesWithTags);
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default searchChallengesActive;
