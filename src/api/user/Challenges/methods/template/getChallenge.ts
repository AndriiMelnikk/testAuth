import { Request, Response } from 'express';
import { PostgrestResponse } from '@supabase/supabase-js';

import ImgPath from '../../../../img/config';
import supabase from '../../../../supabase';

import { StatusCodes } from '../../../../type/statusCode';
import { SchemaChallenges } from '../../../../type/schema';
import { getChallengeTemplate } from '../../type';

import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useGetTags from '../../../../hooks/methods/tag/challenge/useGetTags';
import useGetLengthTags from '../../../../hooks/methods/tag/challenge/useGetLengthTags';

const GetChallenge = async (req: Request, res: Response) => {
  try {
    const { id, tagsPage = 1 }: getChallengeTemplate = req.query;

    const userId = req.cookies.userId;

    CheckValues({ id, tagsPage });

    const template: PostgrestResponse<SchemaChallenges> = await supabase
      .from('challenges')
      .select()
      .eq('id', id)
      .eq('idAuthor', userId)
      .limit(1);

    if (template.error || !template.data) {
      useResponse().Error(res, template.error.message, StatusCodes.BadRequest, WhoseError.server);
    } else {
      const templateRes = { ...template.data[0], img: ImgPath.UserChallengeTemplate + template.data[0].img };

      const tags = await useGetTags(templateRes.id, tagsPage);
      const tagsLength = await useGetLengthTags(templateRes.id);

      const templateWithTags = { ...templateRes, tags, tagsLength };

      useResponse().Send(res, StatusCodes.Success, templateWithTags);
    }
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default GetChallenge;

const CheckValues = ({ id, tagsPage }: getChallengeTemplate) => {
  useCheckValue(id, TypeData.string, 'Params.id');
  useCheckValue(tagsPage, TypeData.number, 'Params.tagsRangePage');
};
