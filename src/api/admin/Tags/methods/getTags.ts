import { Request, Response } from 'express';

import supabase from '../../../supabase';

import { StatusCodes } from '../../../type/statusCode';

import useCheckValue, { TypeData } from '../../../hooks/useCheckValue';
import useRange from '../../../hooks/useRange';
import useResponse, { WhoseError } from '../../../hooks/useResponse';

const getChallenges = async (req: Request, res: Response) => {
  try {
    const { pages = 1, authorId = 'admin' }: { pages?: number; authorId?: string } = req.query;

    useCheckValue(pages, TypeData.number, 'Params.pages');
    useCheckValue(authorId, TypeData.string, 'Params.authorId');

    const { rangeFrom, rangeTo } = useRange(pages);

    const { data: tags, error: errorTags } = await supabase
      .from('tags')
      .select()
      .eq('authorId', authorId)
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
