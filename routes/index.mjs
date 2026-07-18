import productRoutes from './productRouter.mjs';
import categoryRoutes from './categoryRouter.mjs';
import { Router } from 'express';

const router = Router();

router.use(productRoutes);
router.use(categoryRoutes);

export default router;