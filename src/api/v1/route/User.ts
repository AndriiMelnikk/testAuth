import { NextFunction, Request, Response } from 'express';

import supabase from '../../supabase';

import useResponse, { WhoseError } from '../hooks/useResponse';

import { StatusCodes } from '../../type/statusCode';
import { Roles } from '../type/role';

class API {
  private user: { userId: string; role: Roles };

  constructor() {
    this.user = {
      userId: '',
      role: Roles.HR,
    };
  }

  get getUser() {
    return this.user;
  }

  async setUser(req: Request, res: Response) {
    const userId = req.cookies.userId;

    if (!userId) {
      return useResponse().Error(res, "Cookies 'userId' is empty", StatusCodes.BadRequest, WhoseError.web);
    }

    if (userId !== 'admin') {
      const { data: resUser, error: errorUser } = await supabase
        .from('users')
        .select('id, hrDashboardFlag')
        .eq('userId', userId)
        .single();

      if (errorUser) throw new Error('userId is not defined');

      this.user = { userId: resUser?.id, role: Roles.HR };
    } else {
      this.user = { userId: 'admin', role: Roles.ADMIN };
    }
  }

  async checkUser(
    req: Request,
    res: Response,
    func: (req: Request, res: Response, user: { userId: string; role: Roles }) => void,
  ) {
    try {
      await this.setUser(req, res);
      return func(req, res, this.getUser);
    } catch (error: any) {
      return useResponse().Error(res, error.message, StatusCodes.BadRequest, WhoseError.web);
    }
  }

  rolesMiddleware(roles: Roles[] | Roles = []) {
    return [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await this.setUser(req, res);

          roles = typeof roles === 'string' ? [roles] : roles;

          if (roles.length && !roles.includes(this.getUser.role))
            return useResponse().Error(res, 'This path is blocked for you', StatusCodes.NoAcceptable, WhoseError.web);

          next();
        } catch (error) {
          next();
        }
      },
    ];
  }
}

export default API;
