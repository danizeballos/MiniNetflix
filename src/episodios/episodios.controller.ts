import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EpisodiosService } from './episodios.service';
import { CreateEpisodioDto } from './dto/create-episodio.dto';
import { UpdateEpisodioDto } from './dto/update-episodio.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('episodios')
export class EpisodiosController {
  constructor(private readonly episodiosService: EpisodiosService) {}

  // ✅ PÚBLICO
  @Get()
  findAll() {
    return this.episodiosService.findAll();
  }

  // ✅ PÚBLICO
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.episodiosService.findOne(+id);
  }

  // 🔒 PRIVADO
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateEpisodioDto) {
    return this.episodiosService.create(dto);
  }

  // 🔒 PRIVADO
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEpisodioDto) {
    return this.episodiosService.update(+id, dto);
  }

  // 🔒 PRIVADO
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.episodiosService.remove(+id);
  }
}
