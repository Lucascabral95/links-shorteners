import { Click } from "generated/prisma";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseCreateAutoClickDto {

    @ApiProperty()
    clickCreated: Click;

    @ApiProperty()
    @IsString()
    message: string;
}