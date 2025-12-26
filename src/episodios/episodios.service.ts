import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Episodio } from './entities/episodio.entity';
import { CreateEpisodioDto } from './dto/create-episodio.dto';
import { UpdateEpisodioDto } from './dto/update-episodio.dto';
import { Serie } from '../series/entities/series.entity';

@Injectable()
export class EpisodiosService {
  constructor(
    @InjectRepository(Episodio)
    private readonly epiRepo: Repository<Episodio>,
    @InjectRepository(Serie)
    private readonly serieRepo: Repository<Serie>,
  ) {}

  async create(dto: CreateEpisodioDto) {
    try {
      const serie = await this.serieRepo.findOne({
        where: { 
          id: dto.serieId,
          deletedAt: IsNull() 
        }
      });
      
      if (!serie) {
        throw new NotFoundException(`La serie con id ${dto.serieId} no existe`);
      }

      const episodioConMismoNumero = await this.epiRepo.findOne({
        where: {
          serieId: dto.serieId,
          numeroCapitulo: Number(dto.numeroCapitulo),
          deletedAt: IsNull(), 
        }
      });

      if (episodioConMismoNumero) {
        throw new BadRequestException(
          `Ya existe un episodio con el número de capítulo ${dto.numeroCapitulo} en esta serie`
        );
      }

      const episodioConMismoTitulo = await this.epiRepo.findOne({
        where: {
          serieId: dto.serieId,
          titulo: dto.titulo.trim(),
          deletedAt: IsNull(), 
        }
      });

      if (episodioConMismoTitulo) {
        throw new BadRequestException(
          `Ya existe un episodio con el título "${dto.titulo}" en esta serie`
        );
      }
      const episodio = this.epiRepo.create({
        titulo: dto.titulo.trim(), 
        duracion: Number(dto.duracion), 
        numeroCapitulo: Number(dto.numeroCapitulo),
        serie,
        serieId: dto.serieId, 
      });

      return await this.epiRepo.save(episodio);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === '23505') {
        if (error.detail?.includes('numeroCapitulo')) {
          throw new BadRequestException(
            `Ya existe un episodio con el número de capítulo ${dto.numeroCapitulo} en esta serie`
          );
        } else if (error.detail?.includes('titulo')) {
          throw new BadRequestException(
            `Ya existe un episodio con el título "${dto.titulo}" en esta serie`
          );
        }
        throw new BadRequestException('Ya existe un episodio con estos datos en esta serie');
      }
      throw new BadRequestException('Error al crear el episodio');
    }
  }

  async findAll() {
    try {
      return await this.epiRepo.find({ 
        where: { deletedAt: IsNull() }, 
        relations: { serie: true } 
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los episodios');
    }
  }

  async findOne(id: number) {
    try {
      const episodio = await this.epiRepo.findOne({
        where: { 
          id,
          deletedAt: IsNull() 
        },
        relations: { serie: true },
      });
      
      if (!episodio) {
        throw new NotFoundException(`El episodio con id ${id} no existe`);
      }
      
      return episodio;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el episodio');
    }
  }

  async update(id: number, dto: UpdateEpisodioDto) {
    try {
      const episodio = await this.epiRepo.findOne({ 
        where: { 
          id,
          deletedAt: IsNull() 
        }, 
        relations: { serie: true } 
      });
      
      if (!episodio) {
        throw new NotFoundException(`El episodio con id ${id} no existe`);
      }
      const serieIdFinal = dto.serieId || episodio.serieId;
      if (dto.serieId && dto.serieId !== episodio.serieId) {
        const nuevaSerie = await this.serieRepo.findOne({
          where: { 
            id: dto.serieId,
            deletedAt: IsNull() 
          }
        });
        
        if (!nuevaSerie) {
          throw new NotFoundException(`La serie con id ${dto.serieId} no existe`);
        }
        
        episodio.serie = nuevaSerie;
        episodio.serieId = dto.serieId;
      }

      const numeroCapituloFinal = dto.numeroCapitulo !== undefined ? Number(dto.numeroCapitulo) : episodio.numeroCapitulo;
      if (dto.numeroCapitulo !== undefined && dto.numeroCapitulo !== episodio.numeroCapitulo) {
        const episodioConMismoNumero = await this.epiRepo.findOne({
          where: {
            serieId: serieIdFinal,
            numeroCapitulo: numeroCapituloFinal,
            deletedAt: IsNull(), 
          }
        });

        if (episodioConMismoNumero && episodioConMismoNumero.id !== id) {
          throw new BadRequestException(
            `Ya existe otro episodio con el número de capítulo ${numeroCapituloFinal} en esta serie`
          );
        }
      }

      if (dto.titulo !== undefined && dto.titulo.trim() !== episodio.titulo) {
        const episodioConMismoTitulo = await this.epiRepo.findOne({
          where: {
            serieId: serieIdFinal,
            titulo: dto.titulo.trim(), 
            deletedAt: IsNull(), 
          }
        });

        if (episodioConMismoTitulo && episodioConMismoTitulo.id !== id) {
          throw new BadRequestException(
            `Ya existe otro episodio con el título "${dto.titulo}" en esta serie`
          );
        }
      }

      if (dto.titulo !== undefined) episodio.titulo = dto.titulo.trim();
      if (dto.duracion !== undefined) episodio.duracion = Number(dto.duracion); 
      if (dto.numeroCapitulo !== undefined) episodio.numeroCapitulo = Number(dto.numeroCapitulo);
      
      return await this.epiRepo.save(episodio);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === '23505') {
        if (error.detail?.includes('numeroCapitulo')) {
          throw new BadRequestException(
            `Ya existe otro episodio con el número de capítulo ${dto.numeroCapitulo} en esta serie`
          );
        } else if (error.detail?.includes('titulo')) {
          throw new BadRequestException(
            `Ya existe otro episodio con el título "${dto.titulo}" en esta serie`
          );
        }
        throw new BadRequestException('Ya existe otro episodio con estos datos en esta serie');
      }
      throw new BadRequestException('Error al actualizar el episodio');
    }
  }

  async remove(id: number) {
    try {
      const episodio = await this.epiRepo.findOne({
        where: { 
          id,
          deletedAt: IsNull() 
        }
      });
      
      if (!episodio) {
        throw new NotFoundException(`El episodio con id ${id} no existe`);
      }

      await this.epiRepo.softDelete(id);
      return { message: `Episodio con id ${id} eliminado exitosamente`, id };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el episodio');
    }
  }
}