import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/login-user.dto';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {UserInterface} from '../users/interfaces/user.interface'
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/schemas/users.schema';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { FindUserByEmailDto } from 'src/users/dtos/find-user-by-email.dto';

@Injectable()
export class AuthService {
    constructor(private usersService:UsersService,
                private jwtService:JwtService,
                private configService:ConfigService){}
    
    async hashPassword(password:string):Promise<string>{
        const passHash = await bcrypt.hash(password,process.env.HASH_SALT);        
        return passHash
    }
    
    async createUser(createUserDto:CreateUserDto): Promise<Partial<User>> {
        const passHash = await this.hashPassword(createUserDto.password)     
        createUserDto.password = passHash;
        const createdUser = await this.usersService.createUser(createUserDto) as UserInterface
        const {password, profilePicRef, __v, ...rest} = createdUser
        return rest
    }
                
    async validateUser(email:FindUserByEmailDto, password:string):Promise<UserInterface> {
        const user = await this.usersService.findOneByEmailOrNull(email) as UserInterface
        if (!user) {
            throw new NotFoundException('User does not exist')
        }
        const passMatch = await bcrypt.compare(password,user.password)
        if (!passMatch) {
            throw new UnauthorizedException('Provided credentials are invalid')
        }else{  
            const {password, ...result} = user
            return result
        }
    }

    async loginUser(loginUserDto:LoginUserDto):Promise<{ access_token: string, refresh_token: string, user:UserInterface }>{
        const {email, password} = loginUserDto
        const user = await this.validateUser(email, password)
        const payload = {email:user.email, sub:user._id.toString()}
        const access_token = await this.jwtService.signAsync(payload, { expiresIn: '15m'})
        const refresh_token = await this.jwtService.signAsync(payload, { secret:this.configService.get<string>('refreshSecret') , expiresIn: '1d' });
        return {access_token, refresh_token, user};
    }

    async refresh(refreshTokenDto:RefreshTokenDto): Promise<{ access_token: string }> {
        const { refresh_token } = refreshTokenDto;
        // console.log(refresh_token)
        try {
            const payload = await this.jwtService.verifyAsync(refresh_token, { secret: this.configService.get<string>('refreshSecret') });
            // console.log(payload)
            const newPayload = {email:payload.email, sub: payload.sub} 
            const access_token = await this.jwtService.signAsync(newPayload, { expiresIn: '15m' });
            // console.log(access_token)
            return { access_token };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}

