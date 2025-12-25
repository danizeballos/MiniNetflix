import { IsString, MinLength, IsUrl } from 'class-validator';

export class CreateSeriesDto {
  @IsString({ message: 'El titulo debe ser texto' })
  @MinLength(2, { message: 'El titulo debe tener al menos 2 caracteres' })
  titulo: string;

  @IsString({ message: 'El genero debe ser texto' })
  @MinLength(3, { message: 'El genero debe tener al menos 3 caracteres' })
  genero: string;

  @IsString({ message: 'La sinopsis debe ser texto' })
  @MinLength(10, { message: 'La sinopsis debe tener al menos 10 caracteres' })
  sinopsis: string;

  @IsUrl({}, { message: 'urlPortada debe ser una URL valida' })
  urlPortada: string;
}
