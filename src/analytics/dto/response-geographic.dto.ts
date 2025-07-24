import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDateString, IsNumber, IsObject, IsPositive, IsString } from "class-validator";

class CountDto {
    @ApiProperty()
    @IsNumber()
    country: number;

    @ApiProperty()
    @IsNumber()
    city: number;

    @ApiProperty()
    @IsNumber()
    device: number;

    @ApiProperty()
    @IsNumber()
    browser: number;
}

export class BrowserElementDto {
    @ApiProperty({ type: String, nullable: true })
    @IsString()
    country: string | null;

    @ApiProperty({ type: String, nullable: true })
    @IsString()
    city: string | null;

    @ApiProperty()
    @IsString()
    device: string;

    @ApiProperty()
    @IsString()
    browser: string;

    @ApiProperty()
    @IsObject()
    _count: CountDto;
}

class DataIntegrityDto {
    @ApiProperty()
    @IsNumber()
    countriesWithoutCities: number;

    @ApiProperty()
    @IsNumber()
    citiesWithoutCountry: number;

    @ApiProperty()
    @IsBoolean()
    hasIncompleteData: boolean;
}

class MetadataDto {
    @ApiProperty()
    @IsNumber()
    queryLimit: number;

    @ApiProperty()
    @IsDateString()
    timestamp: string;

    @ApiProperty()
    @IsObject()
    dataIntegrity: DataIntegrityDto;
}

class DistributionItemDto {
    @ApiProperty()
    @IsString()
    country?: string;

    @ApiProperty({ required: false })
    @IsString()
    city?: string;

    @ApiProperty({ required: false })
    @IsString()
    device?: string;

    @ApiProperty({ required: false })
    @IsString()
    browser?: string;

    @ApiProperty()
    @IsNumber()
    clicks: number;

    @ApiProperty()
    @IsString()
    percentage: string;
}

class RankingsDto {
    @ApiProperty({ type: () => [DistributionItemDto] })
    @IsArray()
    topCountries: DistributionItemDto[];

    @ApiProperty({ type: () => [DistributionItemDto] })
    @IsArray()
    topCities: DistributionItemDto[];

    @ApiProperty({ type: () => [DistributionItemDto] })
    @IsArray()
    topDevices: DistributionItemDto[];

    @ApiProperty({ type: () => [DistributionItemDto] })
    @IsArray()
    topBrowsers: DistributionItemDto[];
}

class StatsDto {
    @ApiProperty()
    @IsNumber()
    uniqueCountries: number;

    @ApiProperty()
    @IsNumber()
    uniqueCities: number;

    @ApiProperty()
    @IsNumber()
    uniqueDevices: number;

    @ApiProperty()
    @IsNumber()
    uniqueBrowsers: number;

    @ApiProperty()
    @IsNumber()
    countryClicks: number;

    @ApiProperty()
    @IsNumber()
    cityClicks: number;

    @ApiProperty()
    @IsNumber()
    deviceClicks: number;

    @ApiProperty()
    @IsNumber()
    browserClicks: number;

    @ApiProperty()
    @IsNumber()
    totalClicks: number;

    @ApiProperty()
    @IsString()
    topCountry: string;

    @ApiProperty()
    @IsString()
    topCity: string;

    @ApiProperty()
    @IsString()
    topDevice: string;

    @ApiProperty()
    @IsString()
    topBrowser: string;

    @ApiProperty({ type: () => [DistributionItemDto] })
    @IsArray()
    countryDistribution: DistributionItemDto[];

    @ApiProperty({ type: () => [DistributionItemDto] })
    @IsArray()
    deviceDistribution: DistributionItemDto[];

    @ApiProperty({ type: () => [DistributionItemDto] })
    @IsArray()
    browserDistribution: DistributionItemDto[];
}

export class ResponseGeographicDto {
    @ApiProperty({ type: () => [BrowserElementDto] })
    @IsArray()
    geographic: BrowserElementDto[];

    @ApiProperty({ type: () => [BrowserElementDto] })
    @IsArray()
    countries: BrowserElementDto[];

    @ApiProperty({ type: () => [BrowserElementDto] })
    @IsArray()
    cities: BrowserElementDto[];

    @ApiProperty({ type: () => [BrowserElementDto] })
    @IsArray()
    devices: BrowserElementDto[];

    @ApiProperty({ type: () => [BrowserElementDto] })
    @IsArray()
    browsers: BrowserElementDto[];

    @ApiProperty()
    @IsObject()
    stats: StatsDto;

    @ApiProperty()
    @IsObject()
    rankings: RankingsDto;

    @ApiProperty()
    @IsObject()
    metadata: MetadataDto;
}