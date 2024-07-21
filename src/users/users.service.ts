import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FindUserByIdDto } from './dtos/find-user-by-id.dto';
import { FindUserByEmailDto } from './dtos/find-user-by-email.dto';
import { GetUsersQueryParamsDto } from './dtos/get-users-query-params.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    async findAll(query:GetUsersQueryParamsDto):Promise<User[]> {
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

    async findOneByIdOrNull(userId:FindUserByIdDto):Promise<User>|null{
        // console.log(userId)
        const user = await this.userModel.findById(userId.userId).lean().exec()
        if(!user){throw new NotFoundException('User not found')}
        return user
    }

    async findOneByIdAndUpdateOrNull(currentUserId,userId:FindUserByIdDto,updateUserDto: UpdateUserDto): Promise<User>|null {      
        if(currentUserId!==userId.userId){throw new UnauthorizedException("Cannot update other Users' profiles")}
        const user = await this.userModel.findByIdAndUpdate(userId.userId, updateUserDto, {new:true})
        if(!user){throw new NotFoundException('User not found')}
        return user
    }

    async findOneByIdAndDeleteOrNull(userId:FindUserByIdDto): Promise<User>|null {    
        const user = await this.userModel.findByIdAndDelete(userId.userId)
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
