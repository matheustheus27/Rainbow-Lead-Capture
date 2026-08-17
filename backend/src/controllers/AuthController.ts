import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import logger from '../utils/logger';

export class AuthController {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService || new AuthService();
  }

  /**
   * POST /api/auth/login
   * Authenticates administrator credentials and returns JWT token.
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { token, user } = await this.authService.login({ email, password });

      logger.info('Authentication', 'Administrator logged in successfully', {
        userId: user.id,
        email: user.email,
        ip: req.ip || req.socket.remoteAddress,
      });

      res.status(200).json({
        success: true,
        message: 'Authentication successful!',
        token,
        user,
      });
    } catch (error: any) {
      logger.warn('Authentication', 'Failed login attempt', {
        email: req.body.email,
        ip: req.ip || req.socket.remoteAddress,
        reason: error.message,
      });

      res.status(401).json({
        success: false,
        message: error.message || 'Authentication failed. Please verify your credentials.',
      });
    }
  };

  /**
   * GET /api/auth/me
   * Returns current authenticated user session details.
   */
  me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      logger.warn('Authentication', 'Unauthorized session verification attempt', {
        ip: req.ip || req.socket.remoteAddress,
      });
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user.userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  };
}
