import { UserController } from '@/controllers/user.controller';
import { verifyToken } from '@/middleware/token';
import { validateCheckEmail, validateRegisterUser } from '@/middleware/validator';
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
    this.router.post('/google', this.userController.googleRegisterOrLogin);
    this.router.post('/login', this.userController.login);
    this.router.post('/reset-password', verifyToken, this.userController.resetPassword);
    this.router.post('/check-email', validateCheckEmail, this.userController.checkEmail);
    this.router.post('/is-verified', verifyToken, this.userController.isVerified);
    this.router.put('/default-password', this.userController.setDefaultPassword);
  }

  getRouter(): Router {
    return this.router;
  }
}
