import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Roles } from './roles.decorator';
import { RoleGuard } from './role.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //only super admin can create admin and user
  
  //@Roles('admin')
  //@UseGuards(AuthGuard, RoleGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    //if user with his username and unique username is allowed to update his username but not allowed to update other user's username
      return await this.userService.create(createUserDto);
    }
  

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    //here normal user can't specified role to admin , if specified then throw error
    if(createUserDto.role === Role.Admin){
      throw new HttpException("You are not authorized to create admin user", 401);
    }
    //if user with his username and unique username is allowed to update his username but not allowed to update other user's username
    
    return await this.userService.create(createUserDto);
    
  }

  @Get()
  //@Roles('admin')
  //@UseGuards(AuthGuard, RoleGuard)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);


  }

  @Get('username/:uname')
  async findOneByUsername(@Param('uname') uname: string) {
    return await this.userService.findOneByUsername(uname);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user =  await this.userService.update(id, updateUserDto);
    return {
      user
    }
  
  }


  @Roles('admin')
  //@UseGuards(AuthGuard, RoleGuard)
  //@Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id);
    return {
      user: user
    }
  }
}
