import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Link } from "generated/prisma";

export class ResponseCreateLinkDto {
    @ApiProperty()
    @IsString()
    linkCreated: Link;

    @ApiProperty()
    @IsString()
    message: string;
}