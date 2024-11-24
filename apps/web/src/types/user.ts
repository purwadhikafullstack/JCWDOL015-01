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

export interface IChangeProfile{
  name: string;
  birthDate: string
  address: string;
  gender: string;
  education: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IChangeEmail {
  oldEmail: string;
  newEmail: string;
}