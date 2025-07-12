import { IsNumber, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GeneralAnalyticsDto {

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    totalLinks: number;

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    totalClicks: number;

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    totalUsers: number;

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    totalPremiumUsers: number;

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    totalFreeUsers: number;

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    totalGuestUsers: number;

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    totalAdminUsers: number;

    @ApiProperty()
    distributionUsers: {
        _count: {
            role: number;
        },
        role: string;
    }[];

}