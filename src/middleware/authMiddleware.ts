import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Get JWT secret key from environment variables, fallback to a default value if not set
const JWT_SECRET = process.env.JWT_SECRET || 'helloworld';

// Extend Express Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        // Add other user properties here if needed
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    if (!decoded || typeof decoded.id !== 'number') {
      throw new Error('Invalid token format - User ID not found');
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(403).json({ error: 'Forbidden - User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error in authenticateToken middleware:', err);
    return res.status(403).json({ error: 'Forbidden - Authentication failed' });
  }
};
