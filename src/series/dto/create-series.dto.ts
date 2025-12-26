import { IsString, MinLength, IsUrl, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSeriesDto {
  @IsNotEmpty({ message: 'El titulo es requerido' })
  @IsString({ message: 'El titulo debe ser texto' })
  @MinLength(2, { message: 'El titulo debe tener al menos 2 caracteres' })
  titulo: string;

  @IsNotEmpty({ message: 'El genero es requerido' })
  @IsString({ message: 'El genero debe ser texto' })
  @MinLength(3, { message: 'El genero debe tener al menos 3 caracteres' })
  genero: string;

  @IsNotEmpty({ message: 'La sinopsis es requerida' })
  @IsString({ message: 'La sinopsis debe ser texto' })
  @MinLength(10, { message: 'La sinopsis debe tener al menos 10 caracteres' })
  sinopsis: string;

  @IsOptional() 
  @IsUrl({}, { message: 'Si proporcionas urlPortada, debe ser una URL válida' })
  urlPortada?: string;
}
