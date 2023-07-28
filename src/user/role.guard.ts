import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { configuration } from "src/config/configuration";

const matchRoles = (roles: string[], userRoles: string[]) => {
  return roles.some((role: string) => userRoles.includes(role));
};

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.get<string[]>(configuration().roleKey, 
      context.getHandler()
    );
    console.log("requireRoles: ", requireRoles);

    if (!requireRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(requireRoles, user.role);

    
  }
}