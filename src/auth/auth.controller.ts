import { Controller, Get, Post, Body,  HttpCode, HttpStatus, UseGuards, Request , Response} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/user/roles.decorator';
import { RoleGuard } from 'src/user/role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async logIn(@Body(
    'uname') uname: string, @Body('password') password: string) {
     return this.authService.logIn(uname, password);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  @Get('profile')
  async getProfile(@Request() req, @Response() res) {
    return await res.status(HttpStatus.OK).json(req.user);
  }

  
}
