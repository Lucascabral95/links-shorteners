import { IsDate, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetClicksDto {
    @ApiProperty()
    @IsString()
    id: string;

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
    country: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsString()
    device: string;

    @ApiProperty()
    @IsString()
    browser: string;

    @ApiProperty()
    @IsDate()
    createdAt: Date = new Date();

    @ApiProperty()
    @IsDate()
    updatedAt: Date = new Date();
}
