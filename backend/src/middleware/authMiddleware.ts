import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { User, UserRole } from '../models/userModel';

export interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

// Extend Express Request interface locally
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // 1. Primary Check: Check for standard Bearer Token inside HTTP headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // 2. Secondary Fallback Check: Safely pull token from URL string for file streams
    else if (req.query.token) {
      token = req.query.token as string;
    }

    // If neither exists, deny access immediately
    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 3. Verify token validation signature
    const secret = process.env.JWT_SECRET || 'fallback_development_secret_key_32_chars_long';
    const decoded = jwt.verify(token, secret) as DecodedToken;

    // 4. Verify user record still exists inside database cluster
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this active session token no longer exists.', 401));
    }

    // Attach active profile pointer to Request object layout for subsequent middlewares
    (req as any).user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired application token session.', 401));
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};