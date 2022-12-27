import { Request, Response } from 'express';

import supabase from '../../../../supabase';

import { StatusCodes } from '../../../../type/statusCode';
import { StatusChallenge } from '../../../../type/type';

import useCheckValue, { TypeData } from '../../../../hooks/useCheckValue';
import useResponse, { WhoseError } from '../../../../hooks/useResponse';
import useGetUserInCompany from '../../../../hooks/useGetUserInCompany';

const restoreChallengeActive = async (req: Request, res: Response) => {
  try {
    const { id, idAuthor, dateEnd }: { id?: string; idAuthor: string; dateEnd: Date } = req.body;

    id !== undefined
      ? useCheckValue(id, TypeData.string, 'id')
      : useResponse().Error(res, '"id" is undefined', StatusCodes.BadRequest, WhoseError.web);

    idAuthor !== undefined
      ? useCheckValue(idAuthor, TypeData.string, 'idAuthor')
      : useResponse().Error(res, '"idAuthor" is undefined', StatusCodes.BadRequest, WhoseError.web);

    dateEnd !== undefined
      ? useCheckValue(dateEnd, TypeData.date, 'dateEnd', StatusChallenge)
      : useResponse().Error(res, '"dateEnd" is not a data date type', StatusCodes.BadRequest, WhoseError.web);

    const currentDate = new Date();

    if (new Date(dateEnd).getTime() < currentDate.getTime()) {
      useResponse().Error(res, 'The challenge has been resumed', StatusCodes.BadRequest, WhoseError.web);
    }

    let activeChallengeCompany;
    if (idAuthor !== 'admin') {
      const company = await useGetUserInCompany(idAuthor);
      activeChallengeCompany = await supabase
        .from('activeChallengeCompany')
        .update({ status: StatusChallenge.active })
        .eq('challengeId', id)
        .eq('companyId', company.companyId);
    } else {
      activeChallengeCompany = await supabase
        .from('activeChallengeCompany')
        .update({ status: StatusChallenge.active })
        .eq('challengeId', id);
    }

    if (activeChallengeCompany.error)
      useResponse().Error(res, activeChallengeCompany.error.message, StatusCodes.BadRequest, WhoseError.web);

    useResponse().Send(res, StatusCodes.Success, 'Update Challenge');
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default restoreChallengeActive;
