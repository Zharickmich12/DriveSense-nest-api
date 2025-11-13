import { MinLength, IsString, IsOptional, IsBoolean} from "class-validator";

export class CreateCityDto {

    @IsString()
    @MinLength(3, { message: 'The name must have at least 3 characters.' })
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
