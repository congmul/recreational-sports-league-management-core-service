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
      throw err || new UnauthorizedException('There is no valid Token');
    }

    // Check if the token is expired or not
    if(user.exp){
      if(user.exp * 1000 - Date.now() <= 0){
        throw new UnauthorizedException('Token is expired.');
      }
    }

    // If the user doesn't have admin role, Unauthorized.
    if(user.userInfo.role !== "admin"){
        throw new UnauthorizedException('Only admin can access the endpoint');
    }
    return user;
  }
}