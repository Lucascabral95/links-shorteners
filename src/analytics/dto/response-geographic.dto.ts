import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsString } from "class-validator";

export class ResponseGeographicDto {

    @ApiProperty()
    @IsNumber()
    _count: {
        country: number;
    };

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    country: string | null;

    @ApiProperty()
    @IsString()
    city: string | null;

    @ApiProperty()
    @IsString()
    browser: string;

    @ApiProperty()
    @IsString()
    device: string;
}