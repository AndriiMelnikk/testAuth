import Router from 'express';

import getTags from './methogs/getTags';

const RouterTags = new (Router as any)();

RouterTags.get('/', getTags);

export default RouterTags;
