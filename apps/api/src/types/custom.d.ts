type User = {
  id: number;
  email: string;
};

declare namespace Express {
  export interface Request {
    user?: User;
  }
}
