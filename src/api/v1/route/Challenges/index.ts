import Router from 'express';

import TemplateRoute from './controllers/templates/route';

const router = new (Router as any)();

router.use('/templates', TemplateRoute);

export default router;
