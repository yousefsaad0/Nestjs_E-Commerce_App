import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindUserByIdDto {
  @ApiProperty({ type:'string',example: '60d21b4667d0d8992e610c85' })
  @IsString()
  userId: string;
}