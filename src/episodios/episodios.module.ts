import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episodio } from './entities/episodio.entity';
import { Serie } from '../series/entities/series.entity';
import { EpisodiosController } from './episodios.controller';
import { EpisodiosService } from './episodios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Episodio, Serie])],
  controllers: [EpisodiosController],
  providers: [EpisodiosService],
})
export class EpisodiosModule {}
