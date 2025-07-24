import { Role } from "generated/prisma";
import { IsArray, IsBoolean, IsDate, IsEnum, IsInt, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class LinkUserDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    password: string;

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
    @IsString()
    provider: string;
}

export class LinkWithUserDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    originalUrl: string;

    @ApiProperty()
    @IsString()
    shortCode: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    customAlias: string | null;

    @ApiProperty()
    @IsOptional()
    @IsString()
    title: string | null;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description: string | null;

    @ApiProperty()
    @IsOptional()
    @IsString()
    password: string | null;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    expiresAt: Date | null;

    @ApiProperty()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty()
    @IsBoolean()
    isPublic: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    category: string | null;

    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsDate()
    created_at: Date;

    @ApiProperty()
    @IsDate()
    updated_at: Date;

    @ApiProperty({ type: LinkUserDto })
    @IsObject()
    @ValidateNested()
    @Type(() => LinkUserDto)
    user: LinkUserDto;
}

export class CountDto {
    @ApiProperty()
    @IsInt()
    country?: number;

    @ApiProperty()
    @IsInt()
    city?: number;

    @ApiProperty()
    @IsInt()
    device?: number;

    @ApiProperty()
    @IsInt()
    browser?: number;
}

export class CountryStatDto {
    @ApiProperty({ type: CountDto })
    @IsObject()
    @ValidateNested()
    @Type(() => CountDto)
    _count: { country: number };

    @ApiProperty()
    @IsOptional()
    @IsString()
    country: string | null;
}

export class CityStatDto {
    @ApiProperty({ type: CountDto })
    @IsObject()
    @ValidateNested()
    @Type(() => CountDto)
    _count: { city: number };

    @ApiProperty()
    @IsOptional()
    @IsString()
    city: string | null;
}

export class DeviceStatDto {
    @ApiProperty({ type: CountDto })
    @IsObject()
    @ValidateNested()
    @Type(() => CountDto)
    _count: { device: number };

    @ApiProperty()
    @IsString()
    device: string;
}

export class BrowserStatDto {
    @ApiProperty({ type: CountDto })
    @IsObject()
    @ValidateNested()
    @Type(() => CountDto)
    _count: { browser: number };

    @ApiProperty()
    @IsString()
    browser: string;
}

export class GetLinkStatsResponseDto {
    @ApiProperty({ type: LinkWithUserDto, description: 'Información del link con usuario' })
    @IsObject()
    @ValidateNested()
    @Type(() => LinkWithUserDto)
    link: LinkWithUserDto;

    @ApiProperty({ description: 'Total de clicks del link' })
    @IsInt()
    totalClicks: number;

    @ApiProperty({ type: [CountryStatDto], description: 'Estadísticas por países' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CountryStatDto)
    countries: CountryStatDto[];

    @ApiProperty({ type: [CityStatDto], description: 'Estadísticas por ciudades' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CityStatDto)
    cities: CityStatDto[];

    @ApiProperty({ type: [DeviceStatDto], description: 'Estadísticas por dispositivos' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DeviceStatDto)
    devices: DeviceStatDto[];

    @ApiProperty({ type: [BrowserStatDto], description: 'Estadísticas por navegadores' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BrowserStatDto)
    browsers: BrowserStatDto[];
}
