import Router from 'express';

import RouterTemplateChallenge from './getTemplateChallenge';

const routerImg = new (Router as any)();

routerImg.get('/templateChallenge/*', RouterTemplateChallenge);

export default routerImg;
