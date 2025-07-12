import { LoginAuthDto } from "./login-auth.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResponseLoginAuthDto {

    @ApiProperty()
    userLogged: LoginAuthDto;

    @ApiProperty()
    @IsString()
    token: string;

    @ApiProperty()
    @IsString()
    message: string;
}