import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const customerController = new CustomerController();

// Public Endpoints
router.post('/customers', customerController.register);
router.get('/captcha', customerController.getCaptcha);
router.get('/colors', customerController.getRainbowColors);

// Protected Admin Endpoints (Requires valid JWT Bearer Token)
router.get('/customers', authMiddleware as any, customerController.list);
router.get('/admin/analytics', authMiddleware as any, customerController.getAnalytics);

export default router;
