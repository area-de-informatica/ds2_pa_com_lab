import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { CreateUnidadesDto } from './dto/create-unidade.dto';
import { UpdateUnidadesDto } from './dto/update-unidade.dto';

@Controller('unidades')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Post()
  create(@Body() createUnidadeDto: CreateUnidadesDto) {
    return this.unidadesService.create(createUnidadeDto);
  }

  @Get()
  findAll() {
    return this.unidadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnidadeDto: UpdateUnidadesDto) {
    return this.unidadesService.update(id, updateUnidadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unidadesService.remove(id);
  }

  @Get(':id/Contenidos')
    findUnidadesContenido (@Param('id') id: string) {
      return this.unidadesService.findUnidadesContenido(id);
  }

  @Get(':id/Lecciones')
    findUnidadesLecciones (@Param('id') id: string) {
      return this.unidadesService.findUnidadesLecciones(id);
  }
}
