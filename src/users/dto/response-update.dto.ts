import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { GetUserDto } from "./get-user.dto";

export class ResponseUpdateUserDto {
    @ApiProperty({ type: GetUserDto })
    data: GetUserDto;

    @ApiProperty({ example: "User updated successfully" })
    @IsString()
    message: string;
}
