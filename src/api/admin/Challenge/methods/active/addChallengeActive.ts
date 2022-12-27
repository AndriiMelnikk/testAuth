import { Request, Response } from 'express';
import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';

import supabase from '../../../../supabase';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useAddDate from '../../../../hooks/useAddDate';
import { StatusCodes } from '../../../../type/statusCode';
import { StatusChallenge } from '../../../../type/type';
import { SchemaActiveChallengesCompanyData } from '../../type';

const addChallengeActive = async (req: Request, res: Response) => {
  try {
    const { companyId, challengeId, dateStart, prizes, period }: SchemaActiveChallengesCompanyData = req.body;

    useCheckValue(challengeId, TypeData.string, 'challengeId');
    useCheckValue(dateStart, TypeData.date, 'dateStart');
    useCheckValue(prizes, TypeData.string, 'prizes');
    useCheckValue(companyId, TypeData.array, 'companyId');

    const dateFinish = useAddDate(dateStart, period, 'day');

    for (const company of companyId) {
      const isChallenge = await supabase
        .from('activeChallengeCompany')
        .select()
        .eq('companyId', company.id)
        .eq('challengeId', challengeId)
        .neq('status', StatusChallenge.delete)
        .single();

      if (!isChallenge.data) {
        const create = await supabase.from('activeChallengeCompany').insert({
          companyId: company.id,
          challengeId,
          dateStart,
          dateEnd: dateFinish,
          prizes,
          status: StatusChallenge.wait,
        });

        if (create.error) {
          return useResponse().Error(res, create.error.message, StatusCodes.BadRequest, WhoseError.server);
        }
      }
    }

    useResponse().Json(res, StatusCodes.Create, { message: 'Added active challenge' });
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default addChallengeActive;
