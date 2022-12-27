import { Request, Response } from 'express';

import supabase from '../../../../../supabase';

import ImgPath from '../../../../../img/config';

import useRange from '../../../../hooks/useRange';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';

import { StatusCodes } from '../../../../../type/statusCode';
import { QueryGet, RoleGet_s } from './type';
import { StatusChallenge } from '../../../../../type/type';
import { Roles } from '../../../../type/role';

const GetTemplates = async (req: Request, res: Response, { userId, role }: { userId: string; role: Roles }) => {
  try {
    const { page = 1, search = '', author = '', status = '' }: QueryGet = req.query;

    CheckValues({ page, author, search, status });

    const { data, error } = await Supabase(role, { userId, page, author, search, status });

    if (error) {
      return useResponse().Error(res, error.message, StatusCodes.BadRequest, WhoseError.server);
    }

    const arrayChallenges: any = [];

    for (const challengeIs of data) {
      arrayChallenges.push({
        ...challengeIs,
        img: ImgPath.UserChallengeTemplate + challengeIs.img,
      });
    }

    useResponse().Send(res, StatusCodes.Success, arrayChallenges);
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default GetTemplates;

const Supabase: RoleGet_s = async (role, { userId, page, author, search, status }) => {
  const { rangeFrom, rangeTo } = useRange(page);

  const idAuthor = role === Roles.ADMIN ? author : userId;

  return await supabase
    .from('challenges')
    .select('id, name, description, type, period, img, condition')
    .ilike('name', `%${search}%`)
    .eq(idAuthor && 'idAuthor', idAuthor)
    .eq(status && 'status', status)
    .range(rangeFrom, rangeTo);
};

const CheckValues = ({ page, author, search, status }: Partial<QueryGet>) => {
  useCheckValue(page, TypeData.number, 'Params.pages');
  useCheckValue(author, TypeData.string, 'Params.challenges');
  useCheckValue(search, TypeData.string, 'Params.search');
  status && useCheckValue(status, TypeData.includes, 'Params.status', StatusChallenge);
};
