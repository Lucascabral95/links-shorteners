import { IsUUID } from "class-validator";
import { RegisterAuthDto } from "./register-auth.dto";

export class RegisterAuthAutoDto extends RegisterAuthDto {
    @IsUUID()
    id: string;
}