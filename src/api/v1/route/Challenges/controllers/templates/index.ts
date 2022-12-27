import { Request, Response } from 'express';

import User from '../../../User';

import GetTemplate from './getTemplate';
import GetTemplates from './getTemplates';
import CreateTemplate from './createTemplate';
import UpdateTemplate from './updateTemplate';

class TemplateRoute extends User {
  constructor() {
    super();
  }

  getTemplates = async (req: Request, res: Response): Promise<void> => {
    this.checkUser(req, res, GetTemplates);
  };

  getTemplate = async (req: Request, res: Response): Promise<void> => {
    this.checkUser(req, res, GetTemplate);
  };

  createTemplates = async (req: Request, res: Response): Promise<void> => {
    this.checkUser(req, res, CreateTemplate);
  };

  updateTemplates = async (req: Request, res: Response): Promise<void> => {
    this.checkUser(req, res, UpdateTemplate);
  };
}

export default new TemplateRoute();
