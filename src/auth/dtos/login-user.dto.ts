import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { FindUserByEmailDto } from "src/users/dtos/find-user-by-email.dto";

export class LoginUserDto{
    @ApiProperty({
        description:"Email user is attempting to sign in with",
        example:"test6@test.com",
        type:"string"
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: FindUserByEmailDto;

    @ApiProperty({
        description:"Password user is attempting to sign in with",
        example:"test6",
        type:"string"
    })
    @IsString()
    @IsAlphanumeric()
    @IsNotEmpty()
    password:string;

}