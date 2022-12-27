import { Request, Response } from 'express';

import { StatusCodes } from '../../../type/statusCode';

import useResponse, { WhoseError } from '../../../hooks/useResponse';

const getChallenges = async (req: Request, res: Response) => {
  try {
    useResponse().Array(res, StatusCodes.Success, []);
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default getChallenges;
