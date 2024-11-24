
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private UserService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.UserService.findUserForLogin(email);
    if (user && (await user.comparePassword(password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const userInfo = {...user};
    const payload = { sub: user._id, userInfo };
    return {
      userInfo: {...user},
      access_token: this.jwtService.sign(payload),
    };
  }
}
