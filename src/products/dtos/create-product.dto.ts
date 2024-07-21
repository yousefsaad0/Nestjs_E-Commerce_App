import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsArray, IsDate, IsBoolean, ArrayNotEmpty, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Wireless Mouse',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-quality wireless mouse with ergonomic design',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 29.99,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Stock count of the product',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Categories of the product',
    example: ['Electronics', 'Accessories'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({
    description: 'Release date of the product',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  releaseDate?: Date;

  @ApiProperty({
    description: 'Is the product available',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Brand associated with the product',
    example: 'Logitech',
  })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    description: 'Status of the product',
    example: 'ACTIVE',
  })
  @IsEnum(['ACTIVE', 'INACTIVE', 'DISCONTINUED'])
  @IsNotEmpty()
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
}
