import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Serie } from './entities/series.entity';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Serie)
    private readonly serieRepo: Repository<Serie>,
  ) {}

  async create(dto: CreateSeriesDto, usuarioId: number) {
    try {
      const tituloNormalizado = dto.titulo.trim();
      
      const serieExistente = await this.serieRepo
        .createQueryBuilder('serie')
        .where('LOWER(serie.titulo) = LOWER(:titulo)', { titulo: tituloNormalizado })
        .andWhere('serie.deletedAt IS NULL')
        .getOne();

      if (serieExistente) {
        throw new BadRequestException(
          `Ya existe una serie con el título "${tituloNormalizado}". Los títulos deben ser únicos (no se distingue entre mayúsculas y minúsculas).`
        );
      }

      const serieData = {
        ...dto,
        titulo: tituloNormalizado, 
        usuarioId, 
      };
      
      const serie = this.serieRepo.create(serieData);
      return await this.serieRepo.save(serie);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new BadRequestException(
          `Ya existe una serie con el título "${dto.titulo}"`
        );
      }
      throw new BadRequestException('Error al crear la serie');
    }
  }

  async findAll() {
    try {
      const series = await this.serieRepo.find({ 
        where: { deletedAt: IsNull() }, 
        relations: { 
          episodios: true,
          usuario: true
        },
        select: {
          usuario: {
            id: true,
            nombre: true,
            email: true,
          }
        }
      });
      
      return series.map(serie => ({
        ...serie,
        usuario: serie.usuario ? {
          id: serie.usuario.id,
          nombre: serie.usuario.nombre,
          email: serie.usuario.email,
        } : null
      }));
    } catch (error) {
      throw new BadRequestException('Error al obtener las series');
    }
  }

  async findOne(id: number) {
    try {
      const serie = await this.serieRepo.findOne({
        where: { 
          id,
          deletedAt: IsNull() 
        },
        relations: { 
          episodios: true,
          usuario: true
        },
        select: {
          usuario: {
            id: true,
            nombre: true,
            email: true,
          }
        }
      });
      
      if (!serie) {
        throw new NotFoundException(`La serie con id ${id} no existe`);
      }
      
      return {
        ...serie,
        usuario: serie.usuario ? {
          id: serie.usuario.id,
          nombre: serie.usuario.nombre,
          email: serie.usuario.email,
        } : null
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener la serie');
    }
  }

  async update(id: number, dto: UpdateSeriesDto) {
    try {
      const serie = await this.serieRepo.findOne({
        where: { 
          id,
          deletedAt: IsNull() 
        },
        relations: { usuario: true }
      });
      
      if (!serie) {
        throw new NotFoundException(`La serie con id ${id} no existe`);
      }

      if (dto.titulo !== undefined) {
        const tituloNormalizado = dto.titulo.trim();
        if (tituloNormalizado.toLowerCase() !== serie.titulo.toLowerCase()) {
          const serieConMismoTitulo = await this.serieRepo
            .createQueryBuilder('serie')
            .where('LOWER(serie.titulo) = LOWER(:titulo)', { titulo: tituloNormalizado })
            .andWhere('serie.deletedAt IS NULL')
            .andWhere('serie.id != :id', { id })
            .getOne();

          if (serieConMismoTitulo) {
            throw new BadRequestException(
              `Ya existe otra serie con el título "${tituloNormalizado}". Los títulos deben ser únicos (no se distingue entre mayúsculas y minúsculas).`
            );
          }
        }
      }

      const datosActualizados = {
        ...dto,
        titulo: dto.titulo !== undefined ? dto.titulo.trim() : undefined,
      };

      await this.serieRepo.update(id, datosActualizados);
      
      const serieActualizada = await this.serieRepo.findOne({
        where: { id },
        relations: { episodios: true, usuario: true },
        select: {
          usuario: {
            id: true,
            nombre: true,
            email: true,
          }
        }
      });
      
      return {
        ...serieActualizada,
        usuario: serieActualizada?.usuario ? {
          id: serieActualizada.usuario.id,
          nombre: serieActualizada.usuario.nombre,
          email: serieActualizada.usuario.email,
        } : null
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new BadRequestException(
          `Ya existe otra serie con el título "${dto.titulo}"`
        );
      }
      throw new BadRequestException('Error al actualizar la serie');
    }
  }

  async remove(id: number) {
    try {
      const serie = await this.serieRepo.findOne({
        where: { 
          id,
          deletedAt: IsNull() 
        },
        relations: { usuario: true }
      });
      
      if (!serie) {
        throw new NotFoundException(`La serie con id ${id} no existe`);
      }

      await this.serieRepo.softDelete(id);
      return { message: `Serie con id ${id} eliminada exitosamente`, id };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la serie');
    }
  }
}