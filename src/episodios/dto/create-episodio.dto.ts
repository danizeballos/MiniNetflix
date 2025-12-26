import { IsInt, IsString, MinLength, Min, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEpisodioDto {
  @IsNotEmpty({ message: 'El titulo es requerido' })
  @IsString({ message: 'El titulo debe ser texto' })
  @MinLength(2, { message: 'El titulo debe tener al menos 2 caracteres' })
  titulo: string;

  @IsNotEmpty({ message: 'La duracion es requerida. Debe ser un número entero en minutos (ejemplo: 60 para 1 hora, 25 para 25 minutos)' })
  @Type(() => Number)
  @IsNumber({}, { message: 'La duracion debe ser un número. Ingresa la duración en minutos como número entero (ejemplo: 60 para 1 hora, 25 para 25 minutos)' })
  @IsInt({ message: 'La duracion debe ser un número entero. Ingresa solo el número de minutos sin letras ni símbolos (ejemplo: 60 para 1 hora, 25 para 25 minutos)' })
  @Min(1, { message: 'La duracion debe ser mayor a 0 minutos. Ingresa un número entero positivo (ejemplo: 60 para 1 hora, 25 para 25 minutos)' })
  duracion: number;

  @IsNotEmpty({ message: 'El numeroCapitulo es requerido' })
  @Type(() => Number)
  @IsInt({ message: 'El numeroCapitulo debe ser un número entero' })
  @Min(1, { message: 'El numeroCapitulo debe ser mayor a 0' })
  numeroCapitulo: number;

  @IsNotEmpty({ message: 'El serieId es requerido' })
  @Type(() => Number)
  @IsInt({ message: 'El serieId debe ser un número entero' })
  @Min(1, { message: 'El serieId debe ser mayor a 0' })
  serieId: number;
}
