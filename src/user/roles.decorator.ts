import { SetMetadata } from "@nestjs/common";
import { configuration } from "src/config/configuration";

export const Roles = (...roles: string[]) => SetMetadata(configuration().roleKey, roles);