import Router from 'express';
import RouterChallenge from './Challenge';
import RouterCompany from './Company';
import RouterAnalyticsHR from './AnalyticsHR';
import RouterTags from './Tags';

const routerAdmin = new (Router as any)();

routerAdmin.use('/challenge', RouterChallenge);
routerAdmin.use('/company', RouterCompany);
routerAdmin.use('/analyticsHR', RouterAnalyticsHR);
routerAdmin.use('/tags', RouterTags);

export default routerAdmin;
