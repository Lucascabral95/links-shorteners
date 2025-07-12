import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateClickDto {
    @ApiProperty()
    @IsString()
    linkId: string;

    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    ipAddress: string;

    @ApiProperty()
    @IsString()
    userAgent: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    device?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    browser?: string;
}
