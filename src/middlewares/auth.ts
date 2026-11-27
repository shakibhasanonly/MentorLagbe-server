import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { getDB } from '../config/db';

const AUTH_URL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

const JWKS = createRemoteJWKSet(new URL(`${AUTH_URL}/api/auth/jwks`));

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'student' | 'tutor' | 'admin';
  };
}

// Verify JWT Token
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Token is required',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: AUTH_URL,
      audience: AUTH_URL,
    });

    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
      res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
      return;
    }

    const user = await getDB().collection('users').findOne({
      email: payload.email,
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('JWT verification failed:', error);

    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token',
    });
  }
};

// Verify Student Role
export const verifyStudent = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Student access only',
    });
    return;
  }

  next();
};

// Verify Tutor Role
export const verifyTutor = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== 'tutor') {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Tutor access only',
    });
    return;
  }

  next();
};

// Verify Admin Role
export const verifyAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access only',
    });
    return;
  }

  next();
};
