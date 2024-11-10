import { Request } from 'express';
import { Multer } from 'multer'; // Ensure to import the correct type from Multer

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
            file?: Multer.File; // Extend Request to include the file property
        }
    }
}
