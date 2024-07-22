import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";

export class GetQueryParamsDto{
    @ApiProperty({type:'number', default: 1})
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    page?:number;

    @ApiProperty({type:'number', default:5})
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    @Min(0)
    limit?:number;
}