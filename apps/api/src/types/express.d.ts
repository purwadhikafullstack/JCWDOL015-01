import { Developer, User } from '@prisma/client';

declare namespace Express {
  export interface Request {
    user?: User;
    developer?: Developer;
  }
}