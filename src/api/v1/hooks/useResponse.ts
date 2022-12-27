import { Response } from 'express';
import { StatusCodes } from '../../type/statusCode';

type useResponse = () => {
  Error: (res: Response, statusMessage: string, status: StatusCodes, whose: WhoseError) => void;
  Json: (res: Response, status: StatusCodes, json: object) => void;
  Array: (res: Response, status: StatusCodes, arr: any[]) => void;
  Send: (res: Response, status: StatusCodes, send: any) => void;
};

type Error = (res: Response, statusMessage: string, status: StatusCodes, whose: WhoseError) => void;

type Json = (res: Response, status: StatusCodes, json: object) => void;
type Array = (res: Response, status: StatusCodes, arr: any[]) => void;
type Send = (res: Response, status: StatusCodes, send: string | boolean | number) => void;

export enum WhoseError {
  web = 'Web Error.',
  server = 'Server Error.',
}

const useResponse: useResponse = () => {
  const Error: Error = (res, statusMessage, status, whose) => {
    res.statusMessage = `${whose} ${statusMessage}`;
    res.status(status).end();
  };

  const Json: Json = (res, status, json) => {
    res.status(status).json(json).end();
  };

  const Send: Send = (res, status, send) => {
    res.status(status).send(send).end();
  };
  const Array: Array = (res, status, arr) => {
    res.status(status).send(arr).end();
  };

  return { Error, Json, Send, Array };
};

export default useResponse;
