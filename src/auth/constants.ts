import { configuration } from "src/config/configuration";


export const jwtConstants = {
    secret: configuration().jwt.secret,
    expiresIn: configuration().jwt.expiresIn,

}