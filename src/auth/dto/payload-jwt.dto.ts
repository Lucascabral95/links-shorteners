import { Role } from "generated/prisma";
import { IsBoolean, IsDate, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PayloadJwtDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    role: Role;

    @ApiProperty()
    @IsBoolean()
    verified: boolean;

    @ApiProperty()
    @IsString()
    full_name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    picture?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    googleId?: string;

    @ApiProperty()
    @IsDate()
    created_at: Date;
}