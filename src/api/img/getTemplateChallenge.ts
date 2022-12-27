import { Response, Request } from 'express';
import path from 'path';

import Config from '../../config';

import { StatusCodes } from '../type/statusCode';

import useResponse, { WhoseError } from '../hooks/useResponse';

const getTemplateChallenge = async (req: Request, res: Response) => {
  try {
    res.sendFile(path.resolve(Config.DIR_NAME_IMG, req.url));
  } catch (e: any) {
    useResponse().Error(res, e.message, StatusCodes.BadRequest, WhoseError.server);
  }
};

export default getTemplateChallenge;
