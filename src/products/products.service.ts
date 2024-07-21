import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product, ProductSchema } from './schemas/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>){}

    async findAll(){
        return await this.productModel.find()
    }
    
    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const createdProduct = new this.productModel({ ...createProductDto });
        return await createdProduct.save();
    }

    async findProductById(productId:string): Promise<Product>{
        return await this.productModel.findById(productId)
    }

    async updateProduct(productId:string, updateProductDto:UpdateProductDto): Promise<Product>{
        return await this.productModel.findByIdAndUpdate(productId, updateProductDto)
    }

    async deleteProduct(productId:string):Promise<Product>{
        return await this.productModel.findByIdAndDelete(productId)
    }

    // Add any other relevant methods...

}
