import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtTokenData } from '../../../dist/auth/interface/token.interface';
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

      if (!requiredRoles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();

      const token = request?.headers?.authorization?.slice(7);
      if (!token || !token.length) {
        throw new ForbiddenException(
          'You have no permission to access this route',
        );
      }

      const dataFromToken = this.jwtService.verify<jwtTokenData>(token, {
        secret: 'secret-key-of-access_token',
      });
      const userFromDB = await this.userService.findOneByEmail(
        dataFromToken.userEmail,
      );
      const isValidRole = requiredRoles.some((role) =>
        userFromDB.role.includes(role),
      );
      if (!isValidRole)
        throw new ForbiddenException(
          'You have no permission to access this route',
        );
      return true;
    } catch (err) {
      console.log('some error from canActivate role', err.message);
      if (err.message === 'jwt expired') {
        throw new UnauthorizedException('Token expired');
      }
      throw new ForbiddenException(
        'You have no permission to access this route',
      );
      return false;
    }
  }
}
