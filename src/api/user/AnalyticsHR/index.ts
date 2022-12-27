import Router from 'express';

import createAnalytics from './methogs/createAnalytics';

const RouterChallenges = new (Router as any)();

RouterChallenges.post('/', createAnalytics);

export default RouterChallenges;
