import { Link } from "generated/prisma";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResponseUpdateLinkDto {

    @ApiProperty()
    @IsString()
    linkUpdated: Link;

    @ApiProperty()
    @IsString()
    message: string;

}