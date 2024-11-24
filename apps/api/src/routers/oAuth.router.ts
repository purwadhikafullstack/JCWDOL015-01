
import { OAuthController } from '@/controllers/oAuth.controlled';
import { Router } from 'express';

export class OAuthRouter {
  private router: Router;
  private oAuthController: OAuthController;

  constructor() {
    this.oAuthController = new OAuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/google', this.oAuthController.googleOauthHandler);
  }

  getRouter(): Router {
    return this.router;
  }
}
