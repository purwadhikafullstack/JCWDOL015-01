import prisma from '@/prisma';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    // Very from headers authorization token
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify token
    const tokenData = token.split(' ')[1];
    const decodedToken = jwt.verify(tokenData, process.env.JWT!);

    if (!decodedToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedData = JSON.parse(JSON.stringify(decodedToken) as string);

    // Check if user is admin
    prisma.admin.findUnique({
        where: {
            id: Number(decodedData.id)
        }
    }).then((user) => {
        if (!user) {
            return res.status(403).json({ message: 'Access denied: Admins only.' });
        }    
        req.user = user;  
        next();
    }).catch((error) => {
        console.error('Error checking admin:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    });
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
