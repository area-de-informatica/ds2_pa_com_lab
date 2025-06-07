import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContenidosService } from './contenidos.service';
import { CreateContenidoDto } from './dto/create-contenido.dto';
import { UpdateContenidoDto } from './dto/update-contenido.dto';

@Controller('contenidos')
export class ContenidosController {
  constructor(private readonly contenidosService: ContenidosService) {}

  @Post()
  create(@Body() createContenidoDto: CreateContenidoDto) {
    return this.contenidosService.create(createContenidoDto);
  }

  @Get()
  findAll() {
    return this.contenidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contenidosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContenidoDto: UpdateContenidoDto) {
    return this.contenidosService.update(id, updateContenidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contenidosService.remove(id);
  }
}
