import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const serie = await this.serieRepo.findOneBy({ id: dto.serieId });
    if (!serie) return { message: `La serie con id ${dto.serieId} no existe` };

    const episodio = this.epiRepo.create({
      titulo: dto.titulo,
      duracion: dto.duracion,
      numeroCapitulo: dto.numeroCapitulo,
      serie,
    });

    return await this.epiRepo.save(episodio);
  }

  async findAll() {
    return await this.epiRepo.find({ relations: { serie: true } });
  }

  async findOne(id: number) {
    const episodio = await this.epiRepo.findOne({
      where: { id },
      relations: { serie: true },
    });
    return episodio || { message: `El episodio con id ${id} no existe` };
  }

  async update(id: number, dto: UpdateEpisodioDto) {
    const episodio = await this.epiRepo.findOne({ where: { id }, relations: { serie: true } });
    if (!episodio) return { message: `El episodio con id ${id} no existe` };

    // si mandan serieId, validarlo y asociar
    if (dto.serieId) {
      const serie = await this.serieRepo.findOneBy({ id: dto.serieId });
      if (!serie) return { message: `La serie con id ${dto.serieId} no existe` };
      episodio.serie = serie;
    }

    Object.assign(episodio, dto);
    return await this.epiRepo.save(episodio);
  }

  async remove(id: number) {
    const episodio = await this.epiRepo.findOneBy({ id });
    if (!episodio) return { message: `El episodio con id ${id} no existe` };

    await this.epiRepo.softDelete(id);
    return { message: `Episodio con id ${id} eliminado`, id };
  }
}
