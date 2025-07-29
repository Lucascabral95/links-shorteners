import { IsBoolean, IsDate, IsEnum, IsOptional, IsString, MinLength, MaxLength } from "class-validator";
import { Role } from "generated/prisma";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterAuthDto {
    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @ApiProperty()
    @IsString()
    full_name: string;

    @ApiProperty()
    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    verified?: boolean;

    @ApiProperty()
    @IsDate()
    created_at: Date = new Date();

    @ApiProperty()
    @IsDate()
    updated_at: Date = new Date();

    @ApiProperty()
    @IsString()
    @IsOptional()
    provider?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    googleId?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    picture?: string;
}
