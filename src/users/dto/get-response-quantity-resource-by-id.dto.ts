import { IsNumber, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetResponseQuantityResourceByIdDto {
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 1 })
    quantityClicks: number;

    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 1 })
    quantityLinks: number;
}