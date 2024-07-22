import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, Min, IsEnum, IsArray, IsOptional, Max } from "class-validator";
import { Category } from "../enums/category.enum";
import { Status } from "../enums/status.enum";

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
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 29.99,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Category of the product',
    example: 'Electronics',
  })
  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @ApiProperty({
    description: 'SKU of the product',
    example: 'SKU12345',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Images of the product',
    example: ['image1.jpg', 'image2.jpg'],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: 'Brand associated with the product',
    example: 'Logitech',
  })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({
    description: 'Weight of the product',
    example: 1.5,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    description: 'Dimensions of the product',
    example: '10x5x3',
  })
  @IsString()
  @IsOptional()
  dimensions?: string;

  @ApiProperty({
    description: 'Ratings of the product',
    example: 4.5,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  ratings?: number;

  @ApiProperty({
    description: 'Reviews of the product',
    example: ['Great product!', 'Very satisfied'],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  reviews?: string[];

  @ApiProperty({
    description: 'Status of the product',
    example: 'ACTIVE',
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}