import Router from 'express';

import tags from './Tags';
import challenges from './Challenges';

const router = new (Router as any)();

router.use('/challenges', challenges);
router.use('/tags', tags);

export default router;
