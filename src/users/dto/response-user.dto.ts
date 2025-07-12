import { GetUserDto } from "./get-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResponseUserDto extends GetUserDto {
    @ApiProperty()
    @IsString()
    message: string;
}