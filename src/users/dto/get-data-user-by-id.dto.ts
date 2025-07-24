import { IsArray, IsInt, IsObject, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { GetLinksDto } from "src/links/dto";
import { GetClicksDto } from "src/clicks/dto";

export class StatsDto {
    @ApiProperty({ description: 'Cantidad total de links' })
    @IsInt()
    quantityLinks: number;

    @ApiProperty({ description: 'Cantidad total de clicks' })
    @IsInt()
    quantityClicks: number;
}

export class DataDto {
    @ApiProperty({ type: [GetLinksDto], description: 'Array de links' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GetLinksDto)
    links: GetLinksDto[];

    @ApiProperty({ type: [GetClicksDto], description: 'Array de clicks' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GetClicksDto)
    clicks: GetClicksDto[];
}

export class GetUserStatsDto {
    @ApiProperty({ type: StatsDto, description: 'Estadísticas del usuario' })
    @IsObject()
    @ValidateNested()
    @Type(() => StatsDto)
    stats: StatsDto;

    @ApiProperty({ type: DataDto, description: 'Datos de links y clicks' })
    @IsObject()
    @ValidateNested()
    @Type(() => DataDto)
    data: DataDto;
}
