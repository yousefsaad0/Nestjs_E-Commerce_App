import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FindByIdDto } from 'src/common/dtos/find-by-id.dto';

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
    async getProductById(@Param('productId') findProductByIdDto:FindByIdDto): Promise<Product>{
        return await this.productsService.findProductById(findProductByIdDto)
    }

    @ApiOperation({ summary: 'Create a new product' })
    @ApiCreatedResponse({ description: 'Product created successfully.'})
    @ApiBadRequestResponse({ description: 'Invalid product data.' })
    @ApiUnauthorizedResponse({ description: 'You need to be logged-in to access this resource.' })
    @ApiForbiddenResponse({ description: 'You do not have permission to access this resource (Admins only).' })
    @ApiBody({ description: 'Product data to create', type: CreateProductDto })
    @Roles(Role.Admin)
    @Post('/')
    async createProduct(@CurrentUser() creatorId:string, @Body() createProductDto:CreateProductDto):Promise<Product>{
        return await this.productsService.createProduct(creatorId, createProductDto)
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
    async updateProductById(@CurrentUser() currentUserId:string, @Param('productId') findProductByIdDto:FindByIdDto, @Body() updateProductDto:UpdateProductDto):Promise<Product>{
        return await this.productsService.updateProduct(currentUserId, findProductByIdDto, updateProductDto)
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
    async deleteProductById(@Param('productId') findProductByIdDto:FindByIdDto):Promise<Product>{
        return this.productsService.deleteProduct(findProductByIdDto)
    }
}
