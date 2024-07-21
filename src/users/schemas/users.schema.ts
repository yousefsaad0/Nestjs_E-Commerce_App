import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { strict } from "assert";
import { HydratedDocument } from "mongoose";
import { Role } from "src/users/enums/role.enum";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({required:true, type:'string'})
    username:string;
    
    @Prop({required:true, type:'string', unique:true})
    email:string;

    @Prop({required:true, type:'string'})
    password:string;

    @Prop({required:true, type:[String], enum:Role, default:Role.User})
    roles:string[]

    @Prop({type:'string',default:"./public/assets/profile.png"})
    profilePicRef:string
}

export const UserSchema = SchemaFactory.createForClass(User);
 