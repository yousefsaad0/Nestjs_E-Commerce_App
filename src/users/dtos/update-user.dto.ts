import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto{

    @ApiProperty({
        description:"Username user will appear as",
        example:"User123",
        type:"string"
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    username?:string;
    
    // @ApiProperty({
    //     description:"User's password",
    //     example:"Password123",
    //     type:"string"
    // })
    // @IsString()
    // @IsAlphanumeric()
    // @IsOptional()
    // @IsNotEmpty()
    // password?:string;

    @IsOptional()
    profilePicRef?:string;
}