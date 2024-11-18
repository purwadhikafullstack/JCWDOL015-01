export interface IRegister {
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ICheckEmail {
  email: string;
}

export interface IReset {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
