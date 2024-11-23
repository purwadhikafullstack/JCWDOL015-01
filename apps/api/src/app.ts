import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { UserRouter } from './routers/user.router';
import { AdminRouter } from './routers/admin.router';
import { JobRouter } from './routers/job.router';
import { TestRouter } from './routers/test.router';
import { CompanyRouter } from './routers/company.router';
import { ApplicationRouter } from './routers/application.router';
import { AnalyticsRouter } from './routers/analytics.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const userRouter = new UserRouter();
    const adminRouter = new AdminRouter();
    const jobRouter = new JobRouter();
    const companyRouter = new CompanyRouter();
    const applicationRouter = new ApplicationRouter();
    const analyticsRouter = new AnalyticsRouter();
    const testRouter = new TestRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/user', userRouter.getRouter());
    this.app.use('/api/admin', adminRouter.getRouter());
    this.app.use('/api/jobs', jobRouter.getRouter());
    this.app.use('/api/tests', testRouter.getRouter());
    this.app.use('/api/company', companyRouter.getRouter());
    this.app.use('/api/analytics', analyticsRouter.getRouter());
    this.app.use('/api/application', applicationRouter.getRouter());

  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
