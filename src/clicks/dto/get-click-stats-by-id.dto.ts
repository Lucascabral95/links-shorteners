import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

class LinkDto {
    @ApiProperty({ description: 'ID del enlace' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Código corto del enlace' })
    @IsString()
    shortCode: string;

    @ApiProperty({ description: 'URL original' })
    @IsString()
    originalUrl: string;

    @ApiProperty({ description: 'Título del enlace' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Descripción del enlace' })
    @IsString()

    customAlias: string;
    @ApiProperty({ description: 'Alias personalizado del enlace' })
    @IsString()
    alias: string;

    @ApiProperty({ description: 'Fecha de expiración del enlace' })
    @IsDateString()
    expiresAt: Date;

    @ApiProperty({ description: 'Indica si el enlace está activo' })
    @IsNotEmpty()
    isActive: boolean;

    @ApiProperty({ description: 'Indica si el enlace es público' })
    @IsNotEmpty()
    isPublic: boolean;

    @ApiProperty({ description: 'Categoría del enlace' })
    @IsString()
    category: string;

    @ApiProperty({ description: 'Fecha de creación' })
    @IsDateString()
    created_at: Date;

    @ApiProperty({ description: 'Fecha de actualización' })
    @IsDateString()
    updated_at: Date;
}

class UserDto {
    @ApiProperty({ description: 'ID del usuario' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Nombre completo del usuario' })
    @IsString()
    full_name: string;

    @ApiProperty({ description: 'Email del usuario' })
    @IsString()
    email: string;
}

class ClickDto {
    @ApiProperty({ description: 'ID del clic' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'ID del enlace relacionado' })
    @IsString()
    linkId: string;

    @ApiProperty({ description: 'ID del usuario que realizó el clic' })
    @IsString()
    userId: string;

    @ApiProperty({ description: 'Dirección IP desde donde se realizó el clic' })
    @IsString()
    ipAddress: string;

    @ApiProperty({ description: 'User Agent del navegador' })
    @IsString()
    userAgent: string;

    @ApiProperty({ description: 'País desde donde se realizó el clic', nullable: true })
    @IsString()
    @IsOptional()
    country: string | null;

    @ApiProperty({ description: 'Ciudad desde donde se realizó el clic', nullable: true })
    @IsString()
    @IsOptional()
    city: string | null;

    @ApiProperty({ description: 'Tipo de dispositivo' })
    @IsString()
    device: string;

    @ApiProperty({ description: 'Navegador utilizado' })
    @IsString()
    browser: string;

    @ApiProperty({ description: 'Fecha de creación del registro' })
    @IsDateString()
    created_at: Date;

    @ApiProperty({ description: 'Fecha de actualización del registro' })
    @IsDateString()
    updated_at: Date;

    @ApiProperty({ type: LinkDto })
    @IsObject()
    link: LinkDto;

    @ApiProperty({ type: UserDto })
    @IsObject()
    user: UserDto;
}

class MetricItemDto {
    @ApiProperty({ description: 'Valor de la métrica (país, dispositivo, etc.)', nullable: true })
    @IsOptional()
    country?: string | null;

    @IsOptional()
    device?: string;

    @IsOptional()
    browser?: string;

    @ApiProperty({ description: 'Cantidad de ocurrencias' })
    @IsInt()
    count: number;
}

class TimeSeriesItemDto {
    @ApiProperty({ description: 'Fecha del registro' })
    @IsDateString()
    date: Date;

    @ApiProperty({ description: 'Cantidad de clics en esa fecha' })
    @IsInt()
    count: number;
}

class MetricsDto {
    @ApiProperty({ type: [MetricItemDto], description: 'Distribución por países' })
    @IsArray()
    byCountry: MetricItemDto[];

    @ApiProperty({ type: [MetricItemDto], description: 'Distribución por dispositivos' })
    @IsArray()
    byDevice: MetricItemDto[];

    @ApiProperty({ type: [MetricItemDto], description: 'Distribución por ciudades' })
    @IsArray()
    byCity: MetricItemDto[];

    @ApiProperty({ type: [MetricItemDto], description: 'Distribución por navegadores' })
    @IsArray()
    byBrowser: MetricItemDto[];

    @ApiProperty({ type: [TimeSeriesItemDto], description: 'Serie temporal de clics' })
    @IsArray()
    timeSeries: TimeSeriesItemDto[];
}

export class GetClickStatsByIdResponseDto {
    @ApiProperty({ type: ClickDto })
    @IsObject()
    click: ClickDto;

    @ApiProperty({ description: 'Total de clics' })
    @IsInt()
    totalClicks: number;

    @ApiProperty({ type: MetricsDto })
    @IsObject()
    metrics: MetricsDto;

    @ApiProperty({ type: [ClickDto], description: 'Últimos 20 clics' })
    @IsArray()
    clicks: Omit<ClickDto, 'link' | 'user'>[];
}