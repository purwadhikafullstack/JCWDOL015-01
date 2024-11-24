type User = {
  id: number;
  email: string;
};

type Admin = {
  id: number;
  email: string;
}

declare namespace Express {
  export interface Request {
    user?: User;
    admin?: Admin;
  }
}
