import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async logIn(uname: string, password: string) {
    //if username and password are correct, return a message
    const user = await this.userService.findOneByUsername(uname);
  
    if ((await bcrypt.compare(password, user.password)) === false) {
      throw new BadRequestException(`Invalid Credentials . Please try again.`);
    }

    const payload = { uname: user.uname, role: user.role};

    const token =  this.jwtService.sign(payload);

    return {
      token,
    };
  }

 



  
}
