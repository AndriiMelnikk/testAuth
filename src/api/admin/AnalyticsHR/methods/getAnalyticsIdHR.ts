import { Request, Response } from 'express';

import supabase from '../../../supabase';

import useResponse, { WhoseError } from '../../../hooks/useResponse';
import useCheckValue, { TypeData } from '../../../hooks/useCheckValue';

import { StatusCodes } from '../../../type/statusCode';
import { getAnalyticsHR } from '../type';

const getAnalyticsIdHR = async (req: Request, res: Response) => {
  try {
    const {
      companyId,
      userId,
      event = '',
      page = '',
      block = '',
      element = '=',
      date = '',
      time = '',
    }: getAnalyticsHR = req.body;

    const analyticsHR = await supabase
      .from('analyticsHR')
      .select()
      .eq('userId', userId)
      .eq('event', event)
      .eq('page', page)
      .eq('block', block)
      .eq('element', element);

    useResponse().Send(res, StatusCodes.Create, { message: 'add analytics HR' });
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default getAnalyticsIdHR;
