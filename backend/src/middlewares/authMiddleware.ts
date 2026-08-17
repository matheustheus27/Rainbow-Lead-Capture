import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../models/User';
import logger from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

const JWT_SECRET = process.env.JWT_SECRET || 'iris_crm_jwt_super_secret_key_2026';

/**
 * Express middleware to enforce JWT authentication on protected endpoints.
 * Returns 401 Unauthorized on missing, invalid, or expired tokens.
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('AuthMiddleware', 'Unauthorized access attempt: Missing or malformed Authorization header', {
      path: req.originalUrl || req.path,
      method: req.method,
      ip: req.ip || req.socket.remoteAddress,
    });
    res.status(401).json({
      success: false,
      message: 'Access denied: Valid authentication token required.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    logger.warn('AuthMiddleware', 'Unauthorized access attempt: Invalid or expired JWT token', {
      path: req.originalUrl || req.path,
      method: req.method,
      ip: req.ip || req.socket.remoteAddress,
      reason: error.message,
    });
    res.status(401).json({
      success: false,
      message: 'Authentication failed: Invalid or expired session token.',
    });
  }
};
