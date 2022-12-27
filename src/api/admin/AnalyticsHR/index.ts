import Router from 'express';

import getAnalyticsIdHR from './methods/getAnalyticsIdHR';

const RouterChallenges = new (Router as any)();

RouterChallenges.get('/', getAnalyticsIdHR);

export default RouterChallenges;
