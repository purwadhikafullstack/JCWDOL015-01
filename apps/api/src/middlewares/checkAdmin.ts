import { Request, Response, NextFunction } from 'express';

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    // Assuming user role is stored in req.user.role
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only.' });
    }
    next();
};


// import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/react';
// import { NextFunction } from 'express'; // Optional, only if you want to keep using NextFunction

// export const checkAdmin = async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
//     const session = await getSession({ req });

//     if (!session || session.user?.role !== 'admin') {
//         return res.status(403).json({ message: 'Access denied: Admins only.' });
//     }

//     // If the user is an admin, continue to the next middleware or API route handler
//     next();
// };
