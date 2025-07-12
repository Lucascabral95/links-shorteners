import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PasswordResetRequestDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}