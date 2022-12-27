import { Request, Response } from 'express';
import { PostgrestResponse } from '@supabase/supabase-js';

import supabase from '../../../../supabase';

import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useGetUserInCompany from '../../../../hooks/useGetUserInCompany';
import useAddDate from '../../../../hooks/useAddDate';

import { StatusCodes } from '../../../../type/statusCode';
import { createChallengesActive } from '../../type';
import { ActiveChallenge, StatusChallenge } from '../../../../type/type';

const addChallengeActive = async (req: Request, res: Response) => {
  try {
    const {
      idAuthor,
      name,
      description,
      prize,
      dateStart,
      period,
      participant,
      type,
      condition,
    }: createChallengesActive = req.body;

    useCheckValue(name, TypeData.string, 'name');
    useCheckValue(description, TypeData.string, 'description');
    useCheckValue(prize, TypeData.string, 'prize');
    useCheckValue(dateStart, TypeData.date, 'dateStart');
    useCheckValue(period, TypeData.number, 'period');
    useCheckValue(participant, TypeData.obj, 'participant', {}, ['id']);
    useCheckValue(type, TypeData.includes, 'type', ActiveChallenge);
    useCheckValue(condition, TypeData.string, 'condition');
    useCheckValue(idAuthor, TypeData.string, 'userId');

    const create = await supabase.from('challenges').insert({
      name,
      description,
      prize: prize ? true : false,
      status: 'active',
      period,
      participant,
      type,
      condition,
      idAuthor,
    });

    if (create.error) {
      useResponse().Error(res, create.error.message, StatusCodes.BadRequest, WhoseError.server);
    }

    const getId: PostgrestResponse<{ id: string }> = await supabase
      .from('challenges')
      .select('id')
      .eq('name', name)
      .eq('description', description)
      .eq('prize', prize ? true : false)
      .eq('period', period)
      .eq('type', type)
      .eq('condition', condition)
      .eq('idAuthor', idAuthor);

    if (getId.error) {
      useResponse().Error(res, getId.error.message, StatusCodes.BadRequest, WhoseError.server);
    }

    let challengeId = '';

    if (getId.data) challengeId = getId.data[getId.data.length - 1].id;

    const company = await useGetUserInCompany(idAuthor);

    const dateFinish = useAddDate(dateStart, period, 'day');

    const add = await supabase.from('activeChallengeCompany').insert({
      companyId: company.companyId,
      challengeId,
      dateStart,
      dateEnd: dateFinish,
      prizes: prize,
      status: StatusChallenge.active,
    });

    if (add.error) {
      useResponse().Error(res, add.error.message, StatusCodes.BadRequest, WhoseError.server);
    }

    useResponse().Json(res, StatusCodes.Create, { message: 'Added active challenge' });
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default addChallengeActive;
