// Import necessary modules and routers
import './types/custom';
import express, { json, urlencoded, Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PORT } from './config';
// import { TestRouter } from './routers/test.router';
import jobRouter from './routers/job.router';
import applicantRouter from './routers/applicant.router'; 
import { TestRouter } from './routers/test.router';
import interviewRouter from './routers/interview.router';
import applicationRouter from './routers/application.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes(); // Initialize routes
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // Handle 404 Not Found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found!');
      } else {
        next();
      }
    });

    // Handle general errors
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        console.error('Error:', err.stack);
        res.status(500).send('Error!');
      } else {
        next();
      }
    });
  }

  private routes(): void {
    const testRouter = new TestRouter();

    // Public route
    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, This is my API`);
    });

    // Mount routers with appropriate prefixes
    this.app.use('/api/tests', testRouter.getRouter());
    this.app.use('/api/applicants', applicantRouter);
    this.app.use('/api/jobs', jobRouter); 
    this.app.use('/api/interviews', interviewRouter);
    this.app.use('/api/applications', applicationRouter);
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}`);
    });
  }
}
