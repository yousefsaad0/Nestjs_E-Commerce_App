import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './schemas/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetQueryParamsDto } from 'src/common/dtos/get-page-query-params.dto';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { FindByIdDto } from 'src/common/dtos/find-by-id.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>){}

    async findAll(query:GetQueryParamsDto):Promise<Product[]>{
        const { page, limit } = query;
        const skip = limit || 5;
        const offset = (page-1)*limit
        return await this.productModel.find().skip(offset).limit(skip).exec()
    }
    
    async createProduct(creatorId:string, createProductDto: CreateProductDto): Promise<Product> {
        createProductDto.createdBy = creatorId
        const createdProduct = new this.productModel({ ...createProductDto });
        return await createdProduct.save();
    }

    async findProductById(productId:FindByIdDto): Promise<Product>{
        const product = await this.productModel.findById(productId.id)
        if(!product){throw new NotFoundException('Product not found')}
        return product
    }

    async updateProduct(currentUserId:string, productId:FindByIdDto, updateProductDto:UpdateProductDto): Promise<Product>{
        const product = await this.productModel.findById(productId.id)
        if(!product){throw new NotFoundException('Product not found')}
        const creatorId = product.createdBy as UserInterface
        if(currentUserId!==(creatorId._id).toString()){throw new ForbiddenException("Cannot update other Users' products")}
        const updatedProduct = await this.productModel.findByIdAndUpdate(productId.id,updateProductDto)
        return updatedProduct
    }

    async deleteProduct(productId:FindByIdDto):Promise<Product>{
        const product = await this.productModel.findByIdAndDelete(productId.id)
        if(!product){throw new NotFoundException('Product not found')}
        return product
    }

    // Add any other relevant methods...

}
