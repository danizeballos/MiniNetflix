import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Serie } from './entities/series.entity';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Serie)
    private readonly serieRepo: Repository<Serie>,
  ) {}

  async create(dto: CreateSeriesDto) {
    const serie = this.serieRepo.create(dto);
    return await this.serieRepo.save(serie);
  }

  async findAll() {
    // ✅ requisito: al consultar Serie, ver sus episodios
    return await this.serieRepo.find({ relations: { episodios: true } });
  }

  async findOne(id: number) {
    const serie = await this.serieRepo.findOne({
      where: { id },
      relations: { episodios: true },
    });
    return serie || { message: `La serie con id ${id} no existe` };
  }

  async update(id: number, dto: UpdateSeriesDto) {
    const serie = await this.serieRepo.findOneBy({ id });
    if (!serie) return { message: `La serie con id ${id} no existe` };

    await this.serieRepo.update(id, dto);
    return await this.serieRepo.findOne({
      where: { id },
      relations: { episodios: true },
    });
  }

  async remove(id: number) {
    const serie = await this.serieRepo.findOneBy({ id });
    if (!serie) return { message: `La serie con id ${id} no existe` };

    await this.serieRepo.softDelete(id);
    return { message: `Serie con id ${id} eliminada`, id };
  }
}
