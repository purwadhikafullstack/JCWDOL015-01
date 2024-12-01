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
    this.router.post(
      '/reset-password',
      verifyToken,
      this.userController.resetPassword,
    );
    this.router.post('/check-email', this.userController.checkEmail);
    this.router.post('/is-verified', this.userController.isVerified);
    this.router.post(
      '/update-profile',
      verifyToken,
      this.userController.updateProfile,
    );
    this.router.post(
      '/change-password',
      verifyToken,
      this.userController.changePassword,
    );
    this.router.post(
      '/change-email',
      verifyToken,
      this.userController.changeEmail,
    );
    this.router.post(
      '/change-profile-picture',
      verifyToken,
      uploader('profilePicture', '/profile-picture').single('profilePicture'),
      this.userController.changeProfilePicture,
    );
    this.router.post(
      '/save-location',
      verifyToken,
      this.userController.saveLocation,
    );
    this.router.post('/dashboard-verify', this.userController.dashboardVerify);
    this.router.post('/save-jobs', this.userController.saveJob);
    this.router.post('/remove-saved-job', this.userController.removeSavedJob);
    this.router.post('/saved-jobs', this.userController.getSavedJobs);
  }

  getRouter(): Router {
    return this.router;
  }
}
