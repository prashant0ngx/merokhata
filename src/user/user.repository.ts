import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export default class UserRepository{
    
    constructor(@InjectModel(User.name) private userModel : Model<User>){}

    async addUser(user : CreateUserDto ) : Promise<User>{
        const newUser = new this.userModel(user);
        return await newUser.save();
    }

    async getUserById(id : string) : Promise<User>{
        //except password
        return await this.userModel.findById({_id : id}).select('-password').exec();

    }


    async getUserByUsername(uname : string) : Promise<User>{
        //except password, role 
        return await this.userModel.findOne({uname : uname}).exec();
    }

   
    async updateUser(id : string, user : UpdateUserDto) : Promise<User>{
        return await this.userModel.findByIdAndUpdate({_id : id}, user).exec();
    }
 


    async deleteUser(id : string) : Promise<User>{
        return await this.userModel.findByIdAndDelete({_id : id}).exec();
    }

    async getAllUsers() : Promise<User[]>{
        //except password
        return await this.userModel.find().exec();
    }



}