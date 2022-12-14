import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './user_roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      console.log({ requiredRoles });
      if (!requiredRoles || requiredRoles[0] === Role.ALL) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const token = request?.headers?.authorization?.slice(7);
      console.log({ token });
      if (!token || !token.length) {
        throw new ForbiddenException(
          'You have no permission to access this route',
        );
      }

      const dataFromToken = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY_ACCESS_TOKEN,
      });

      const userFromDB = await this.userService.findOneByEmail(
        dataFromToken.email,
      );
      console.log({ userFromDB });

      const isValidRole = requiredRoles.some((role) =>
        userFromDB.roles.includes(role),
      );
      if (!isValidRole)
        throw new ForbiddenException(
          'You have no permission to access this route',
        );
      return true;
    } catch (err) {
      console.log('some error from canActivate role', err);
      if (err.message === 'jwt expired') {
        throw new UnauthorizedException('Token expired');
      }
      throw new ForbiddenException(
        'You have no permission to access this route',
      );
    }
  }
}
