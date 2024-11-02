import { UserController } from '@/controllers/user.controller';
import { verifyToken } from '@/middleware/token';
import { validateRegisterUser } from '@/middleware/validator';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', validateRegisterUser, this.userController.register);
    this.router.post('/verify/:token', verifyToken, this.userController.verify);
    this.router.post('/login', this.userController.login);
  }

  getRouter(): Router {
    return this.router;
  }
}
