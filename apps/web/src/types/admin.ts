export interface IRegAdmin {
  companyName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface ILoginAdmin {
  email: string;
  password: string;
}

export interface ICheckAdminEmail {
  email: string;
}

export interface IResetAdmin {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IChangeAdminProfile {
  companyName: string;
  companyDescription: string;
  phoneNumber: string;
}

export interface IChangeAdminPassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IChangeAdminEmail {
  oldEmail: string;
  newEmail: string;
}
