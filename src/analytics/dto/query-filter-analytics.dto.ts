import { IsNumber, IsOptional, IsPositive, IsEnum, IsDateString } from "class-validator";
import { envs } from "src/config/envs";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export enum Period {
    '1h', '12h', '24h', '7d', '30d', '90d', '1y'
}

enum Type {
    'daily', 'weekly', 'monthly'
}

export class QueryFilterAnalyticsTopLinksDto {
    @ApiProperty()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    limit: number = envs.linksFilterQuantity;

    @ApiProperty()
    @IsEnum(Period)
    period: Period;

    @ApiProperty()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    @IsPositive()
    page: number = 1;
}

export class QueryFilterAnalyticsTimeSeriesDto {
    @ApiProperty()
    @IsEnum(Type)
    type: Type = Type.daily;

    @ApiProperty()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    page: number = 1;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    startDate?: string | Date;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    endDate?: string | Date;

    @ApiProperty()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    limit: number = envs.linksFilterQuantity;
}