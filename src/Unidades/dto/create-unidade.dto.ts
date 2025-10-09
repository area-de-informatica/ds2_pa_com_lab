import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUnidadesDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    text: string;

    @IsString()
    @IsNotEmpty()
    cursoId: string; // ID del curso al que pertenece la unidad
}
