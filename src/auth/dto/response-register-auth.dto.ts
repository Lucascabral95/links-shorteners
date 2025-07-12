import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { RegisterAuthDto } from "./register-auth.dto";

export class ResponseRegisterAuthDto {

    @ApiProperty()
    userCreated: RegisterAuthDto;

    @ApiProperty()
    @IsString()
    message: string;
}