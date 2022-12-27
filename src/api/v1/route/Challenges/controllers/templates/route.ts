import { Router } from 'express';

import TemplateRoute from '.';

const router = Router();

router.get('/:template', TemplateRoute.getTemplate);
router.get('/', TemplateRoute.getTemplates);
router.post('/', TemplateRoute.createTemplates);
router.put('/', TemplateRoute.updateTemplates);

export default router;
