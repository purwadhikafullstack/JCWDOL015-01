import { UserController } from '@/controllers/user.controller';
import { verifyToken } from '@/middleware/token';
import { uploader } from '@/middleware/uploader';
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
    this.router.post('/reset-password', verifyToken, this.userController.resetPassword);
    this.router.post('/check-email', this.userController.checkEmail);
    this.router.post('/is-verified', verifyToken, this.userController.isVerified);
    this.router.post('/update-profile', verifyToken, this.userController.updateProfile);
    this.router.post('/change-password', verifyToken, this.userController.changePassword);
    this.router.post('/change-email', verifyToken, this.userController.changeEmail);
    this.router.post('/change-profile-picture', verifyToken, uploader("profilePicture", "/profile-picture").single('profilePicture') , this.userController.changeProfilePicture);
    this.router.post('/save-location', verifyToken, this.userController.saveLocation);
  }

  getRouter(): Router {
    return this.router;
  }
}
