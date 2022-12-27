import Router from 'express';

import RouterChallenges from './Challenges';
import RouterAnalyticsHR from './AnalyticsHR';
import RouterTags from './Tags';

const routerShared = new (Router as any)();

routerShared.use('/challenge', RouterChallenges);
routerShared.use('/analyticsHR', RouterAnalyticsHR);
routerShared.use('/tags', RouterTags);

export default routerShared;
