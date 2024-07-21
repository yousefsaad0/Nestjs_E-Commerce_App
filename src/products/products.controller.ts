import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { Product } from './schemas/products.schema';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private productsService:ProductsService){}

    @Get('/')
    async getAllProducts(){
        return await this.productsService.findAll()
    }
    
    @Get('/:productId')
    async getProductById(productId:string): Promise<Product>{
        return await this.productsService.findProductById(productId)
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Post('/')
    async createProduct(@Body() createProductDto:CreateProductDto){
        return await this.productsService.createProduct(createProductDto)
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Patch('/:productId')
    async updateProductById(productId:string, @Body() updateProductDto:UpdateProductDto):Promise<Product>{
        return this.productsService.updateProduct(productId, updateProductDto)
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Delete('/:productId')
    async deleteProductById(productId:string):Promise<Product>{
        return this.productsService.deleteProduct(productId)
    }
}
