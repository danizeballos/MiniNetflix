import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  // ✅ PÚBLICO
  @Get()
  findAll() {
    return this.seriesService.findAll();
  }

  // ✅ PÚBLICO
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne(+id);
  }

  // 🔒 PRIVADO
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateSeriesDto) {
    return this.seriesService.create(dto);
  }

  // 🔒 PRIVADO
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSeriesDto) {
    return this.seriesService.update(+id, dto);
  }

  // 🔒 PRIVADO
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seriesService.remove(+id);
  }
}
