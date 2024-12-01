import { IAdmin } from '@/types/admin';
import { IUser } from '@/types/user';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token not found');

    const verifiedToken = verify(token, process.env.JWT!) as IUser;
    req.user = verifiedToken;
    next();
  } catch (error) {
    res.status(401).send({
      message: "Unauthorized, Token not found"
    });
  }
};

export const verifyAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token not found');

    const verifiedToken = verify(token, process.env.JWT!) as IAdmin;
    req.admin = verifiedToken;
    next();
  } catch (error) {
    res.status(401).send({
      message: 'Unauthorized',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};