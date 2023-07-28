import { HttpException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import UserRepository from "./user.repository";
import * as bcrypt from "bcrypt";
import { configuration } from "src/config/configuration";
import { Role } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    //if wrong role is specified
    if ( !Object.values(Role).some((role) => role === createUserDto.role || createUserDto.role === undefined)){
      throw new HttpException("Invalid role", 400);
   }
   //if user with entered username already exists then throw error
   const  user = await this.userRepo.getUserByUsername(createUserDto.uname);
    if(user){
      throw new HttpException("User with this username already exists", 400);
    }

    //hash password
    const salt = bcrypt.genSaltSync(configuration().bcrypt.saltOrRounds);
    const hash = bcrypt.hashSync(createUserDto.password, salt);
    createUserDto.password = hash;
    return this.userRepo.addUser(createUserDto);
  }

  async findAll() {
    const user = await this.userRepo.getAllUsers();
    return user;
  }

  async findOne(id: string) {
    //if error occurs, it will be caught by global exception filter
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new HttpException("Invalid Id", 400);
    }
    const user = await this.userRepo.getUserById(id);
    if (!user) {
      throw new HttpException("User not found", 404);
    }
    return user;
  }

  async findOneByUsername(uname: string) {
   const user = await this.userRepo.getUserByUsername(uname);
    if (!user) {
      throw new HttpException("User not found", 404);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    //if role  that doesn't exist wrong then throw error
    //enum to string array
   
    if ( !Object.values(Role).some((role) => role === updateUserDto.role)){
        throw new HttpException("Invalid role", 400);
    }
    //Only admin can update role to admin and user and not allowed to update other user's role to admin
    if (
      updateUserDto.role === Role.Admin &&
      (await this.userRepo.getUserById(id)).role !== Role.Admin
    ) {
      throw new HttpException(
        "You are not authorized to update role to admin",
        401
      );
    }

    // if user with his username and unique username is allowed to update his username but not allowed to update other user's username
    if ((await this.userRepo.getUserById(id)).uname !== updateUserDto.uname) {
      const user = await this.userRepo.getUserByUsername(updateUserDto.uname);
      if (user) {
        throw new HttpException("User with this username already exists", 400);
      }
    }
    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(updateUserDto.password, salt);
    updateUserDto.password = hash;
    return await this.userRepo.updateUser(id, updateUserDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.userRepo.deleteUser(id);
  }
}
