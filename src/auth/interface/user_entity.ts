import { Role } from '../role/user_roles.enum';
export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  roles?: Role[];
}
