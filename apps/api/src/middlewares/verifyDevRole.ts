import { Request, Response, NextFunction } from 'express';

export const verifyDeveloperRole = (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.body;

    if (role !== 'DEVELOPER') {
        return res.status(403).json({ message: 'Akses hanya untuk developer.' });
    }

    next();
};
