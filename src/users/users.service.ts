import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FindByIdDto } from '../common/dtos/find-by-id.dto';
import { FindUserByEmailDto } from './dtos/find-user-by-email.dto';
import { GetQueryParamsDto } from '../common/dtos/get-page-query-params.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    async findAll(query:GetQueryParamsDto):Promise<User[]> {
        const { page, limit } = query;
        // console.log(page,limit)
        const skip = limit || 5;
        const offset = (page-1)*limit
        // console.log(`skip:${skip}, offset:${offset}`)
        return await this.userModel.find().skip(offset).limit(skip).exec()
    }

    async findOneByEmailOrNull(email:FindUserByEmailDto):Promise<User>|null{
        const user = await this.userModel.findOne({email:email}).lean().exec();
        if(!user){throw new NotFoundException('User not found')}
        return user
    }

    async findOneByIdOrNull(userId:FindByIdDto):Promise<User>|null{
        // console.log(userId)
        const user = await this.userModel.findById(userId.id).lean().exec()
        if(!user){throw new NotFoundException('User not found')}
        return user
    }

    async findOneByIdAndUpdateOrNull(currentUserId,userId:FindByIdDto,updateUserDto: UpdateUserDto): Promise<User>|null {      
        if(currentUserId!==userId.id){throw new ForbiddenException("Cannot update other Users' profiles")}
        const user = await this.userModel.findByIdAndUpdate(userId.id, updateUserDto, {new:true})
        if(!user){throw new NotFoundException('User not found')}
        return user
    }

    async findOneByIdAndDeleteOrNull(userId:FindByIdDto): Promise<User>|null {    
        const user = await this.userModel.findByIdAndDelete(userId.id)
        if(!user){throw new NotFoundException('User not found')}
        return user
    }
    
    async createUser(createUserDto:CreateUserDto): Promise<User> {
        const createdUser = new this.userModel({username:createUserDto.username, email:createUserDto.email, password:createUserDto.password, roles:createUserDto.roles, profilePicRef:createUserDto.profilePicRef});
        await createdUser.save()
        const userObject = createdUser.toObject()
        return userObject
    }

}
