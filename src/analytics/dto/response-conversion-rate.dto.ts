import { ApiProperty } from "@nestjs/swagger";

export class ResponseConversionRateDto {

    @ApiProperty()
    metrics: {
        totalLinks: number;
        totalClicks: number;
        conversionRate: string;
        clickRatio: string;
        timestamp: Date;
    }

}