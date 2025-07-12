import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAutoClickDto {
    @ApiProperty()
    @IsString()
    linkId: string;

    @ApiProperty()
    @IsString()
    userId: string;
}