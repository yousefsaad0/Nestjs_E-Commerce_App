import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Model, Mongoose } from "mongoose";
import { Category } from "../enums/category.enum";
import { User } from "src/users/schemas/users.schema";

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
    @Prop({required:true, type:mongoose.Schema.Types.ObjectId, ref:'User'})
    createdBy: User;
    
    @Prop({ required: true, type: 'string' })
    name: string;

    @Prop({ required: true, type: 'string' })
    description: string;

    @Prop({ required: true, type: 'number' })
    price: number;

    @Prop({ required: true, enum: Category })
    category: Category;

    @Prop({ required: true, unique: true, type: 'string' })
    sku: string;

    @Prop({ required: true, type: 'number' })
    quantity: number;

    @Prop({ type: ['string'] })
    images?: string[];

    @Prop({ type: 'string' })
    brand?: string;

    @Prop({ type: 'number' })
    weight?: number;

    @Prop({ type: 'string' })
    dimensions?: string;

    @Prop({ default: Date.now, type: 'date' })
    createdAt?: Date;

    @Prop({ default: Date.now, type: 'date' })
    updatedAt?: Date;

    @Prop({ type: 'number', min: 0, max: 5 })
    ratings?: number;

    @Prop({ type: ['string'] })
    reviews?: string[];

    @Prop({ type: 'string', default: 'ACTIVE' })
    status?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);