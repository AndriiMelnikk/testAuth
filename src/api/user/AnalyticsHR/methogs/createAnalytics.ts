import { Request, Response } from 'express';

import supabase from '../../../supabase';

import useResponse, { WhoseError } from '../../../hooks/useResponse';
import useCheckValue, { TypeData } from '../../../hooks/useCheckValue';

import { StatusCodes } from '../../../type/statusCode';
import { SchemaAnalytics } from '../../../type/schema';

import { EventAnalytics } from '../type';

const createChallenges = async (req: Request, res: Response) => {
  try {
    const analyticsHr: SchemaAnalytics[] = req.body;

    for (const analytics of analyticsHr) {
      const { userId, event, page, block, element, date, time } = analytics;
      useCheckValue(userId, TypeData.string, 'userId');
      useCheckValue(event, TypeData.includes, 'event', EventAnalytics);
      useCheckValue(page, TypeData.string, 'page');
      useCheckValue(date, TypeData.date, 'date');
      useCheckValue(time, TypeData.time, 'time');

      const data = await supabase.from('analyticsHR').insert({
        userId,
        event,
        page,
        block,
        element,
        date,
        time,
      });

      if (data.error) {
        useResponse().Error(res, data.statusText, StatusCodes.BadRequest, WhoseError.server);
      }
    }

    useResponse().Send(res, StatusCodes.Create, { message: 'add analytics HR' });
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default createChallenges;
