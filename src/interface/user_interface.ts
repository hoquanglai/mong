export interface User {
  id: number;
  isActive: boolean;
  email: string;
  password: string;
  roles: string[];
}
