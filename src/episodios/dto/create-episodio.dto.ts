import { IsInt, IsString, MinLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEpisodioDto {
  @IsString()
  @MinLength(2)
  titulo: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  duracion: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  numeroCapitulo: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  serieId: number;
}
