import { Request, Response } from 'express';

import supabase from '../../../supabase';

import useResponse, { WhoseError } from '../../../hooks/useResponse';
import useCheckValue, { TypeData } from '../../../hooks/useCheckValue';
import useRange from '../../../hooks/useRange';

import { StatusCodes } from '../../../type/statusCode';

const getChallenges = async (req: Request, res: Response) => {
  try {
    const { pages = 1, search = '' }: { pages?: number; search?: string } = req.query;

    useCheckValue(pages, TypeData.number, 'Params.pages');
    useCheckValue(search, TypeData.string, 'Params.search');

    const { rangeFrom, rangeTo } = useRange(pages);

    const { data: challenges, error: errorChallenges } = await supabase
      .from('company')
      .select()
      .ilike('name', `%${search}%`)
      .range(rangeFrom, rangeTo);

    if (errorChallenges) {
      useResponse().Error(res, errorChallenges.message, StatusCodes.BadRequest, WhoseError.server);
    }

    if (challenges) useResponse().Array(res, StatusCodes.Success, challenges);

    useResponse().Send(res, StatusCodes.Success, []);
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default getChallenges;
