// import './types/custom';
// import express, {
//   json,
//   urlencoded,
//   Express,
//   Request,
//   Response,
//   NextFunction,
//   Router,
// } from 'express';
// import cors from 'cors';
// import { PORT } from './config';
// import { TestRouter } from './routers/test.router';
// // import { SampleRouter } from './routers/sample.router';
// import { TestController } from '../controllers/test.controller'; // Adjust the import path
// import { checkAdmin } from '../middlewares/checkAdmin';

// export default class App {
//   private app: Express;

//   constructor() {
//     this.app = express();
//     this.configure();
//     this.routes(); 
//     this.handleError();
// }


//   private configure(): void {
//     this.app.use(cors());
//     this.app.use(json());
//     this.app.use(urlencoded({ extended: true }));
//   }

//   private handleError(): void {
//     // not found
//     this.app.use((req: Request, res: Response, next: NextFunction) => {
//       if (req.path.includes('/api/')) {
//         res.status(404).send('Not found !');
//       } else {
//         next();
//       }
//     });

//     // error
//     this.app.use(
//       (err: Error, req: Request, res: Response, next: NextFunction) => {
//         if (req.path.includes('/api/')) {
//           console.error('Error : ', err.stack);
//           res.status(500).send('Error !');
//         } else {
//           next();
//         }
//       },
//     );
//   }

//   // private routes(): void {
//   //   const sampleRouter = new SampleRouter();

//   //   this.app.get('/api', (req: Request, res: Response) => {
//   //     res.send(`Hello, Purwadhika Student API!`);
//   //   });

//   //   this.app.use('/api/samples', sampleRouter.getRouter());
//   // }
//   private routes(): void {
//     const testRouter = new TestRouter(); 

//     // Public route
//     this.app.get('/api', (req: Request, res: Response) => {
//       res.send(`Hello, This is my API`);
//     });

//     // Protecting the /api/events route using authMiddleware
//     this.app.use('/api/tests', testRouter.getRouter());  

//   }

//   public start(): void {
//     this.app.listen(PORT, () => {
//       console.log(`  ➜  [API] Local:   http://localhost:${PORT}/api`);
//     });
//   }
// }

import './types/custom'; // Custom type definitions for Express
import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { TestRouter } from './routers/test.router'; // Ensure the path is correct

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes(); // Call routes to initialize them
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

    // Use the test router for '/api/tests'
    this.app.use('/api', testRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/api`);
    });
  }
}
