export interface ILoginP {
  username: string;
  password: string;
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  role: RoleTypeEnum;
  created_at: string;
  updated_at: string;
}

export interface IRegister {
  name: string;
  username: string;
  password: string;
  role: RoleTypeEnum;
}
export interface ILogin {
  token: string;
  user: IUser;
}

export interface IChangePassword {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export enum RoleTypeEnum {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  USER = "user",
}
