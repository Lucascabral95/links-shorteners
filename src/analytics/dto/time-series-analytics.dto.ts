import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, ValidateNested } from "class-validator";
import { GetClicksDto } from "src/clicks/dto";
import { Type } from "class-transformer";

export class TimeSeriesAnalyticsDto {

    @ApiProperty()
    @IsNumber()
    quantityClicks: number;

    @ApiProperty()
    @IsNumber()
    totalPages: number;

    @ApiProperty()
    @IsNumber()
    currentPage: number;

    @ApiProperty()
    @IsArray()
    @Type(() => GetClicksDto)
    timeSeries: GetClicksDto[];

    @ApiProperty({ type: [GetClicksDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GetClicksDto)
    clicks: GetClicksDto[];

}