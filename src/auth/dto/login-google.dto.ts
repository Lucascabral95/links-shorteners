import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginGoogleDto {
    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    googleId: string;

    @ApiProperty()
    @IsString()
    full_name: string;

    @ApiProperty()
    @IsString()
    picture: string;
}