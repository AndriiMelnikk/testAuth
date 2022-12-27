import Router from 'express';

import getCompany from './methods/getCompanies';

const RouterCompany = new (Router as any)();

RouterCompany.get('/all', getCompany);

export default RouterCompany;
