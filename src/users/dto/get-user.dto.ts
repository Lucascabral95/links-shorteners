import { Role } from "generated/prisma";
import { IsArray, IsBoolean, IsDate, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { GetLinksDto } from "src/links/dto";
import { GetClicksDto } from "src/clicks/dto";

export class GetUserDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    full_name: string;

    @ApiProperty()
    @IsEnum(Role)
    role: Role;

    @ApiProperty()
    @IsBoolean()
    verified: boolean;

    @ApiProperty()
    @IsDate()
    created_at: Date;

    @ApiProperty()
    @IsDate()
    updated_at: Date;

    @ApiProperty()
    @IsOptional()
    @IsString()
    googleId: string | null;

    @ApiProperty()
    @IsOptional()
    @IsString()
    picture: string | null;

    @ApiProperty()
    @IsOptional()
    @IsString()
    provider: string;

    @ApiProperty({ type: [GetLinksDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GetLinksDto)
    links: GetLinksDto[];

    @ApiProperty({ type: [GetClicksDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GetClicksDto)
    clicks: GetClicksDto[];
}