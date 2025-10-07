// src/Cursos/cursos.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

// El decorador @Controller define el prefijo de la ruta base para todos los endpoints en este archivo.
// En este caso, todas las rutas empezarán con /cursos
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  // POST /cursos
  // Este endpoint crea un nuevo curso.
  // @Body() extrae los datos del cuerpo de la petición.
  // UsePipes(ValidationPipe) activa las validaciones que definimos en el DTO.
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  // GET /cursos
  // Este endpoint devuelve una lista de todos los cursos.
  @Get()
  findAll() {
    return this.cursosService.findAll();
  }

  // GET /cursos/:id
  // Este endpoint devuelve un curso específico basado en su ID.
  // @Param('id') extrae el ID de la URL.
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(id);
  }

  // PATCH /cursos/:id
  // Este endpoint actualiza un curso existente.
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(id, updateCursoDto);
  }

  // DELETE /cursos/:id
  // Este endpoint elimina un curso existente.
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(id);
  }
}
