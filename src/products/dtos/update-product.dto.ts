import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber, Min, IsEnum, IsArray } from "class-validator";
import { Status } from "../enums/status.enum";

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Description of the product',
    example: 'A high-quality wireless mouse with ergonomic design',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Price of the product',
    example: 29.99,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Quantity of the product',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Images of the product',
    example: ['image1.jpg', 'image2.jpg'],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Weight of the product',
    example: 1.5,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({
    description: 'Dimensions of the product',
    example: '10x5x3',
  })
  @IsString()
  @IsOptional()
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Status of the product',
    example: Status.ACTIVE,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional({
    description: 'Updated date of the product',
    // example: new Date().toISOString(),
  })
  @IsOptional()
  updatedAt?: Date = new Date();
}
