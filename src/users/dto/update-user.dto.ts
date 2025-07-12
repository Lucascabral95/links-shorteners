import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    @IsString()
    @IsOptional()
    full_name?: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    verified?: boolean;
}
