import { Role } from '../role/user_roles.enum';
export interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
  roles?: Role[];
  access_token?: string;
  refresh_token?: string;
  register_token?: string;
  password_token?: string;
}
