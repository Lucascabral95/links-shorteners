import { ApiProperty } from "@nestjs/swagger";

export class ResponseDeviceBrowserDistributionDto {
    @ApiProperty({
        description: 'Device and browser statistics',
        example: {
            totalDevices: 1,
            totalBrowsers: 1,
            uniqueDevices: ['desktop'],
            uniqueBrowsers: ['unknown'],
            totalRecords: 2
        }
    })
    deviceStats: {
        totalDevices: number;
        totalBrowsers: number;
        uniqueDevices: string[];
        uniqueBrowsers: string[];
        totalRecords: number;
    };

    @ApiProperty({
        description: 'Device totals',
        example: { desktop: 2 }
    })
    deviceTotals: Record<string, number>;

    @ApiProperty({
        description: 'Query metadata',
        example: {
            queryLimit: 1,
            recordsReturned: 2,
            hasMoreData: false
        }
    })
    metadata: {
        queryLimit: number;
        recordsReturned: number;
        hasMoreData: boolean;
    };
}
