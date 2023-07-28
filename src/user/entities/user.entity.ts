import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export  enum Role{
    User = 'user',
    Admin = 'admin',
}

@Schema()
export class User {
   

    @Prop({ required: true , unique: true})
    uname: string;

    @Prop({ required: true })
    password: string;

    @Prop({required:true , enum: Role, default: Role.User})
    role: Role;

    @Prop({ required: true, default: Date.now})
    createdAt: Date;

    @Prop({ required: true, default: Date.now})
    updatedAt: Date;

    

}

export const UserSchema = SchemaFactory.createForClass(User);
