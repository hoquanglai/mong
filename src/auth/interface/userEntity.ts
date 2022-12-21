import { Role } from '../role/user_roles.enum';
export interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
  avatar: string | null;
  isActive: boolean;
  roles?: Role[];
  verify_token?: string;
}
