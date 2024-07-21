import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto{

    @ApiProperty({
        description:"Username user will appear as",
        example:"User123",
        type:"string"
    })
    // @IsString()
    @IsNotEmpty()
    username;
   
    @ApiProperty({
        description:"Email user is signing up with",
        example:"valid@email.com",
        type:"string"
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({
        description:"User's password",
        example:"Password123",
        type:"string"
    })
    @IsString()
    @IsAlphanumeric()
    @IsNotEmpty()
    password:string;

    @ApiProperty({
        description:"User's roles",
        example:['admin'],
        type:[String],
        isArray:true,
        required:false,
        default:['user']
    })
    @IsOptional()
    @IsArray()
    roles?:string[] = ['user'];

    @ApiProperty({
        description: 'Reference to the user\'s profile picture location in the local storage',
        example: './public/assets/profile.png',
        required: false,
        default: './public/assets/profile.png',
    })
    @IsOptional()
    @IsString()
    profilePicRef?:string = "./public/assets/profile.png"
}