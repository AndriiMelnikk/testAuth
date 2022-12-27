import { Request, Response } from 'express';
import { PostgrestResponse } from '@supabase/supabase-js';

import ImgPath from '../../../../../img/config';
import supabase from '../../../../../supabase';

import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useGetTags from '../../../../hooks/controller/tag/challenge/useGetTags';
import useGetLengthTags from '../../../../hooks/controller/tag/challenge/useGetLengthTags';

import { StatusCodes } from '../../../../../type/statusCode';
import { SchemaChallenges } from '../../../../../type/schema';
import { Roles } from '../../../../type/role';
import { RoleGet } from './type';

const GetTemplate = async (req: Request, res: Response, { userId, role }: { userId: string; role: Roles }) => {
  try {
    const idTemplate = req.params.template;

    const template: PostgrestResponse<SchemaChallenges> = await Supabase(role, { userId, idTemplate });

    if (template.error) {
      return useResponse().Error(res, template.error.message, StatusCodes.BadRequest, WhoseError.server);
    }

    if (!template.data?.length) {
      return useResponse().Error(res, 'No found the template of challenge', StatusCodes.NotFound, WhoseError.web);
    }

    const templateRes = { ...template.data[0], img: ImgPath.UserChallengeTemplate + template.data[0].img };

    const tags = await useGetTags(templateRes.id, 1);
    const tagsLength = await useGetLengthTags(templateRes.id);

    const templateWithTags = { ...templateRes, tags, tagsLength };

    useResponse().Send(res, StatusCodes.Success, templateWithTags);
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default GetTemplate;

const Supabase: RoleGet = async (role, { userId, idTemplate }) => {
  const idAuthor = role !== Roles.ADMIN ? userId : '';

  return await supabase
    .from('challenges')
    .select()
    .eq('id', idTemplate)
    .eq(idAuthor && 'idAuthor', userId)
    .limit(1);
};
