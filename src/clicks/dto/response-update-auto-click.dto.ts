import { Click } from "generated/prisma";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseUpdateAutoClickDto {

    @ApiProperty()
    @IsString()
    clickUpdated: Click;

    @ApiProperty()
    @IsString()
    message: string;
}