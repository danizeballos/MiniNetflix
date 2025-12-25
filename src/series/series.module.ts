import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Serie } from './entities/series.entity';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';

@Module({
  imports: [TypeOrmModule.forFeature([Serie])],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [TypeOrmModule],
})
export class SeriesModule {}
