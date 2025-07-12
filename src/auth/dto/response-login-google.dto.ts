import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResponseLoginGoogleDto {
    @ApiProperty()
    @IsString()
    token: string;

    @ApiProperty()
    @IsString()
    message: string;
}