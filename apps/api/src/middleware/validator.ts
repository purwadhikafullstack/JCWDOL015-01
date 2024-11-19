import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRegisterUser = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .notEmpty()
    .withMessage('Email cannot be empty'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .notEmpty()
    .withMessage('Password cannot be empty'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        message: 'Validation error',
        error: errors.array(),
      });
    }
    next();
  },
];

export const validateRegisterAdmin = [
  body('companyName').notEmpty().withMessage('Company name cannot be empty'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .notEmpty()
    .withMessage('Email cannot be empty'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .notEmpty()
    .withMessage('Password cannot be empty'),
  body('phoneNumber').notEmpty().withMessage('Phone number cannot be empty'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        message: 'Validation error',
        error: errors.array(),
      });
    }
    next();
  },
];

export const validateCheckEmail = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .notEmpty()
    .withMessage('Email cannot be empty'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        message: 'Validation error',
        error: errors.array(),
      });
    }
    next();
  },
];
