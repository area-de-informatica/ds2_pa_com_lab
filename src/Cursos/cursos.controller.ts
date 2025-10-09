// src/Cursos/cursos.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { InscribirUsuarioDto } from './dto/inscribir-usuario.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../Usuarios/schemas/usuarios.schema';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  // POST /cursos
  // Crea un nuevo curso. (Solo para Admins)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  // GET /cursos
  // Devuelve una lista de todos los cursos. (Para todos los usuarios autenticados)
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.cursosService.findAll();
  }

  // POST /cursos/:cursoId/inscribir
  // Inscribe a un usuario en un curso. (Solo para Admins)
  @Post(':cursoId/inscribir')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  inscribirUsuario(@Param('cursoId') cursoId: string, @Body() inscribirUsuarioDto: InscribirUsuarioDto) {
    return this.cursosService.inscribirUsuario(cursoId, inscribirUsuarioDto.usuarioId);
  }

  @Post(':cursoId/eliminar-estudiante')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  eliminarEstudiante(@Param('cursoId') cursoId: string, @Body() inscribirUsuarioDto: InscribirUsuarioDto) {
    return this.cursosService.eliminarEstudiante(cursoId, inscribirUsuarioDto.usuarioId);
  }

  // GET /cursos/:id
  // Devuelve un curso específico. (Para todos los usuarios autenticados)
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(id);
  }

  // PATCH /cursos/:id
  // Actualiza un curso. (Solo para Admins)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(id, updateCursoDto);
  }

  // DELETE /cursos/:id
  // Elimina un curso. (Solo para Admins)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.cursosService.remove(id);
  }
}
