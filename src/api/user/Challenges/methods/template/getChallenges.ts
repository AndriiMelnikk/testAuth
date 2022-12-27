import { Request, Response } from 'express';

import ImgPath from '../../../../img/config';
import supabase from '../../../../supabase';

import { StatusCodes } from '../../../../type/statusCode';
import { StatusChallenge } from '../../../../type/type';
import { getChallengesTemplate } from '../../type';

import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';
import useRange from '../../../../hooks/useRange';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';

const GetChallenges = async (req: Request, res: Response) => {
  try {
    const { page = 1, status = StatusChallenge.active }: getChallengesTemplate = req.query;

    const userId = req.cookies.userId;

    CheckValues({ page, status });

    const { rangeFrom, rangeTo } = useRange(page);

    const { data: challengesTemplate, error: errorChallenges } = await supabase
      .from('challenges')
      .select('id, name, description, type, period, img, condition')
      .eq('status', status)
      .eq('idAuthor', userId)
      .range(rangeFrom, rangeTo);

    const arrayChallenges: any = [];

    if (challengesTemplate)
      for (const challengeIs of challengesTemplate) {
        arrayChallenges.push({
          ...challengeIs,
          img: ImgPath.UserChallengeTemplate + challengeIs.img,
        });
      }

    if (errorChallenges) {
      useResponse().Error(res, errorChallenges.message, StatusCodes.BadRequest, WhoseError.server);
    } else if (!errorChallenges && arrayChallenges?.length === 0) {
      useResponse().Array(res, StatusCodes.Success, []);
    }
    useResponse().Send(res, StatusCodes.Success, arrayChallenges);
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default GetChallenges;

const CheckValues = ({ page, status }: getChallengesTemplate) => {
  useCheckValue(page, TypeData.number, 'Params.pages');
  useCheckValue(status, TypeData.includes, 'Params.status', StatusChallenge);
};
