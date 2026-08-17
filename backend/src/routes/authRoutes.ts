import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.get('/me', authMiddleware as any, authController.me as any);

export default router;
