import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { Product } from './schemas/products.schema';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetQueryParamsDto } from 'src/common/dtos/get-page-query-params.dto';

@ApiTags("Products")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
    constructor(private productsService:ProductsService){}

    @ApiOperation({ summary: 'Fetch paginated list of all products' })
    @ApiOkResponse({ description: 'List of products fetched successfully.'})
    @ApiUnauthorizedResponse({ description: 'You need to be logged-in to access this resource.' })
    @ApiForbiddenResponse({ description: 'You do not have permission to access this resource (Admins only).' })
    @Roles(Role.Admin)
    @Get('/')
    async getAllProducts(@Query() queryParams:GetQueryParamsDto): Promise<Product[]>{
        const page = queryParams.page || 1;
        const limit = queryParams.limit || 5;
        return await this.productsService.findAll({page, limit})
    }
    
    @ApiOperation({ summary: 'Fetch a product by ID' })
    @ApiOkResponse({ description: 'Product fetched successfully.'})
    @ApiNotFoundResponse({ description: 'Product not found.' })
    @ApiParam({ name: 'productId', description: 'Product ID', type: 'string' })
    @ApiUnauthorizedResponse({ description: 'You need to be logged-in to access this resource.' })
    @Get('/:productId')
    async getProductById(productId:string): Promise<Product>{
        return await this.productsService.findProductById(productId)
    }

    @ApiOperation({ summary: 'Create a new product' })
    @ApiCreatedResponse({ description: 'Product created successfully.'})
    @ApiBadRequestResponse({ description: 'Invalid product data.' })
    @ApiUnauthorizedResponse({ description: 'You need to be logged-in to access this resource.' })
    @ApiForbiddenResponse({ description: 'You do not have permission to access this resource (Admins only).' })
    @ApiBody({ description: 'Product data to create', type: CreateProductDto })
    @Roles(Role.Admin)
    @Post('/')
    async createProduct(@Body() createProductDto:CreateProductDto){
        return await this.productsService.createProduct(createProductDto)
    }

    @ApiOperation({ summary: 'Update a product by ID' })
    @ApiOkResponse({ description: 'Product updated successfully.'})
    @ApiNotFoundResponse({ description: 'Product not found.' })
    @ApiBadRequestResponse({ description: 'Invalid product data.' })
    @ApiUnauthorizedResponse({ description: 'You need to be logged-in to access this resource.' })
    @ApiForbiddenResponse({ description: 'You do not have permission to access this resource (Admins only).' })
    @ApiParam({ name: 'productId', description: 'Product ID', type: 'string' })
    @ApiBody({ description: 'Product data to update', type: UpdateProductDto })
    @Roles(Role.Admin)
    @Patch('/:productId')
    async updateProductById(productId:string, @Body() updateProductDto:UpdateProductDto):Promise<Product>{
        return this.productsService.updateProduct(productId, updateProductDto)
    }

    @ApiOperation({ summary: 'Delete a product by ID' })
    @ApiOkResponse({ description: 'Product deleted successfully.'})
    @ApiNotFoundResponse({ description: 'Product not found.' })
    @ApiUnauthorizedResponse({ description: 'You need to be logged-in to access this resource.' })
    @ApiForbiddenResponse({ description: 'You do not have permission to access this resource (Admins only).' })
    @ApiParam({ name: 'productId', description: 'Product ID', type: 'string' })
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @Delete('/:productId')
    async deleteProductById(productId:string):Promise<Product>{
        return this.productsService.deleteProduct(productId)
    }
}
