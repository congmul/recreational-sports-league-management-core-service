import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthAdminGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
    }

  handleRequest(err, user, info) {    
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    // If the user doesn't have admin role, Unauthorized.
    if(user.userInfo.role !== "admin"){
        throw new UnauthorizedException();
    }
    return user;
  }
}