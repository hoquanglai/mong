import { Role } from '../role/user_roles.enum';
export interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
  roles?: Role[];
  access_token?: string;
  verify_token?: string;
}
