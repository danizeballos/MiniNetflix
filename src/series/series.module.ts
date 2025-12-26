import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Serie } from './entities/series.entity';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Serie]),
    AuthModule, 
  ],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [TypeOrmModule],
})
export class SeriesModule {}
