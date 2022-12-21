import { IUser } from 'src/auth/interface/userEntity';

export class MyProfileDto {
  id: number;
  email: string;
  name: string;
  roles: string[];
  avatar?: string | null;
  isActive: boolean;
  public constructor(user: IUser) {
    console.log({ user });
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.roles = user.roles;
    this.avatar = user.avatar;
    this.isActive = user.isActive;
  }
}
