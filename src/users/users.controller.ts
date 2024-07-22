import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Session, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { RolesGuard } from './guards/roles.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserInterface } from './interfaces/user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FindUserByIdDto } from './dtos/find-user-by-id.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetQueryParamsDto } from '../common/dtos/get-page-query-params.dto';

@ApiTags("Users")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService:UsersService,
    ){}

    @ApiOperation({ summary: 'Fetch paginated list of all users' })
    @ApiResponse({ status: 200, description: 'Paginated list of users returned successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status:401, description: 'You need to be logged-in to access this resource.' })
    @ApiResponse({status:403, description:"You do not have permission to access this resource (Admins only)"})
    @Get()
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    async findAll(@Query() queryParams:GetQueryParamsDto):Promise<User[]>  {
        const page = queryParams.page || 1;
        const limit = queryParams.limit || 5;
        return await this.usersService.findAll({page, limit})
    }


    @ApiOperation({summary:"Fetches user profile"})
    @ApiOkResponse({description:"User profile fetched successfully"})
    @ApiUnauthorizedResponse({description:"Access Denied"})
    @Get("/profile")
    getProfile(@Session() session:any):Partial<User>{
        const user = session.user as UserInterface
        const {__v, ...rest} = user
        return rest
    }
    
    @ApiOperation({ summary: 'Find a user by ID' })
    @ApiResponse({ status: 200, description: 'User found'})
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiParam({ name: 'userId', description: 'User ID', type:'string'})
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @Get("/:userId")
    async getUserById(@Param("userId") userParam:string):Promise<User>{
        const findUserByIdDto = new FindUserByIdDto;
        findUserByIdDto.userId = userParam
        return await this.usersService.findOneByIdOrNull(findUserByIdDto)
    }
    
    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiResponse({ status: 200, description: 'User updated successfully'})
    @ApiResponse({status:403, description:"You do not have permission to access this resource (Admins only)"})
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiParam({ name: 'userId', description: 'User ID', type:'string'})
    @ApiBody({ description: 'User data to update', type: UpdateUserDto })
    @Patch("/:userId")
    async updateUser(@Param("userId") userParam:string, @CurrentUser() currentUserId:string, @Body() updateUserDto:UpdateUserDto):Promise<User>{
        const findUserByIdDto = new FindUserByIdDto;
        findUserByIdDto.userId = userParam
        return await this.usersService.findOneByIdAndUpdateOrNull(currentUserId,findUserByIdDto, updateUserDto);
    }

    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({ status: 200, description: 'User deleted successfully'})
    @ApiResponse({status:403, description:"You do not have permission to access this resource (Admins only)"})
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @Delete("/:userId")
    async deleteUser(@Param("userId") userParam:string):Promise<User>{
        const findUserByIdDto = new FindUserByIdDto;
        findUserByIdDto.userId = userParam
        return await this.usersService.findOneByIdAndDeleteOrNull(findUserByIdDto)
    }


    @ApiOperation({ summary: 'Upload profile picture for specific user based on ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Profile picture file',
        required: true,
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    @ApiParam({ name: 'userId', required: true, description: 'User ID', type:'string' })
    @ApiCreatedResponse({description: 'Profile picture uploaded successfully' })
    @ApiBadRequestResponse({ description: 'Unsupported file type or file upload failed' })
    @ApiUnauthorizedResponse({ description: "You need to be logged in to perform this request or Cannot modify other Users' profiles" })
    @Post('/:userId/pfp')
    @UseInterceptors(FileInterceptor('file',{storage:diskStorage({destination:'./public/uploads',filename(req, file, callback) {
      const uniqueSuffix = Date.now();
      // const ext = extname(file.originalname);
      const [prefix, ext] = file.originalname.split('.')
      const filename = `${prefix}_${uniqueSuffix}.${ext}`
      callback(null, filename)
    }}),
        fileFilter(req, file, callback) {
          if(!file.originalname.match(/\.(jpg|jpeg|gif|png)$/)){
            return callback(new Error('Unsupported file type'), false)
          }
          return callback(null, true)
        },
  }))
    async uploadProfilePic(@Param('userId') userParam:string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUserId:string,
    // @Session() session:any
    ){

        // if (!file) {
        //     throw new BadRequestException('File upload failed or Unsupported file type');
        //   }
        
        // const currentUser = session.user
        // if(!currentUser){
        //     throw new UnauthorizedException('You need to be logged in to perform this request')
        // }
        // else if (currentUser._id!==userParam){throw new UnauthorizedException("Cannot modify other Users' profiles")}
        console.log(file)
        const findUserByIdDto = new FindUserByIdDto;
        findUserByIdDto.userId = userParam
        return await this.usersService.findOneByIdAndUpdateOrNull(currentUserId,findUserByIdDto, {profilePicRef:file.path})
    }
}

