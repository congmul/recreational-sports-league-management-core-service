import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Loggin', description: 'Loggin' })
    @ApiBody({ type: LoginDto }) // Attach the LoginDto schema to Swagger
    async login(@Request() req) {        
      return this.authService.login(req.user);
    }
}
