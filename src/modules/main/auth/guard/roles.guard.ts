import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import Role from 'src/entities/roles.enum';
import { User } from 'src/entities/user.entity';
import RequestWithUser from 'src/modules/main/auth/interface/requestWithUser.interface';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.role.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
