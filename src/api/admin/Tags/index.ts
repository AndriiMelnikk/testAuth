import Router from 'express';

import getTags from './methods/getTags';

const RouterTags = new (Router as any)();

RouterTags.get('/', getTags);

export default RouterTags;
