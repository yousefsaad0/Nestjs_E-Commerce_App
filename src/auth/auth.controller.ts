import { Body, Controller, Get, Post, Redirect ,Req, Session, UseInterceptors } from '@nestjs/common';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthService } from './auth.service';
import { User } from '../users/schemas/users.schema';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthHeaderInterceptor } from './interceptors/add-token.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({summary:"Creates new user"})
    @ApiCreatedResponse({description:"New user created successfully"})
    @ApiBadRequestResponse({description:"Invalid username/password provided"})
    @Post("/signup")
    signUp(@Body() user: CreateUserDto):Promise<Partial<User>> {
        return this.authService.createUser(user)
    }
    
    @ApiOperation({ summary: 'Logs in and authenticates user' })
    @ApiCreatedResponse({ description: 'Authentication succeeded, auth token issued' })
    @ApiNotFoundResponse({ description: 'User does not exist' })
    @ApiUnauthorizedResponse({ description: 'Incorrect password' })
    @Post('/login')
    @UseInterceptors(AuthHeaderInterceptor)
    async login(@Body() loginUserDto: LoginUserDto, @Session() session:any): Promise<{access_token:string, refresh_token:string}> {
        const loginResult = await this.authService.loginUser(loginUserDto);
        const { access_token, refresh_token, user } = loginResult;
        // console.log(user)
        session.user = user
        session.userId = user._id
        session.refresh_token = refresh_token
        return {access_token, refresh_token}
    }

    @ApiOperation({ summary: 'Logs out the authenticated user' })
    @ApiOkResponse({ description: 'User logged out successfully' })
    @Get('/logout')
    @Redirect('/')
    async logout(@Session()session:any, @Req() req: Request){
        req.session = null
    }

    @ApiOperation({ summary: 'Refreshes access token using refresh token' })
    @ApiCreatedResponse({ description: 'Access token refreshed successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
    @Post('/refresh')
    async refresh( @Session() session:any): Promise<{access_token:string}> {
        const refresh_token = session.refresh_token
        const refreshTokenDto = {refresh_token}
        const access_token = await this.authService.refresh(refreshTokenDto);
        return access_token
    }
}

