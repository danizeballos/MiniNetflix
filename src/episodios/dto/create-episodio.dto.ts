import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateEpisodioDto {
  @IsString({ message: 'El titulo debe ser texto' })
  @MinLength(2, { message: 'El titulo debe tener al menos 2 caracteres' })
  titulo: string;

  @IsInt({ message: 'duracion debe ser un entero' })
  @IsPositive({ message: 'duracion debe ser positiva' })
  duracion: number;

  @IsInt({ message: 'numeroCapitulo debe ser un entero' })
  @IsPositive({ message: 'numeroCapitulo debe ser positivo' })
  numeroCapitulo: number;

  @IsInt({ message: 'serieId debe ser un numero' })
  @IsPositive({ message: 'serieId debe ser positivo' })
  serieId: number;
}
