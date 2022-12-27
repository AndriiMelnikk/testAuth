import { Request, Response } from 'express';

import supabase from '../../../supabase';

import { StatusCodes } from '../../../type/statusCode';

import useCheckValue, { TypeData } from '../../../hooks/useCheckValue';
import useRange from '../../../hooks/useRange';
import useResponse, { WhoseError } from '../../../hooks/useResponse';
import useGetUserInCompany from '../../../hooks/useGetUserInCompany';

const getChallenges = async (req: Request, res: Response) => {
  try {
    const { pages = 1 }: { pages?: number } = req.query;
    const userId = req.cookies.userId;

    useCheckValue(pages, TypeData.number, 'Params.pages');

    const company = await useGetUserInCompany(userId);

    const { rangeFrom, rangeTo } = useRange(pages);

    const { data: tags, error: errorTags } = await supabase
      .from('tags')
      .select()
      .eq('companyId', company.companyId)
      .range(rangeFrom, rangeTo);

    if (!errorTags && tags?.length !== 0) {
      useResponse().Array(res, StatusCodes.Success, tags);
    } else if (!errorTags) {
      useResponse().Send(res, StatusCodes.Success, false);
    } else {
      useResponse().Error(res, errorTags.message, StatusCodes.BadRequest, WhoseError.server);
    }
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default getChallenges;
