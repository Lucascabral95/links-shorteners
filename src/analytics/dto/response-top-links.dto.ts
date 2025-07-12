import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class ResponseTopLinksDto {

    @ApiProperty()
    @IsNumber()
    quantityLinks: number;

    @ApiProperty()
    @IsNumber()
    totalPages: number;

    @ApiProperty()
    @IsNumber()
    currentPage: number;

    @ApiProperty({
        isArray: true,
        type: 'array',
        items: {
            type: 'object',
            properties: {
                _count: {
                    type: 'object',
                    properties: {
                        linkId: { type: 'number' }
                    }
                },
                linkId: { type: 'string' },
                userId: { type: 'string' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
            }
        }
    })
    topLinks: {
        _count: {
            linkId: number
        },
        linkId: string,
        userId: string,
        created_at: Date,
        updated_at: Date
    }[];

}