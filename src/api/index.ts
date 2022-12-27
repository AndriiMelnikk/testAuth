import Router from 'express';

import v1Router from './v1/route';

const router = new (Router as any)();

router.use('/v1', v1Router);

export default router;
