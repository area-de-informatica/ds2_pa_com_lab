import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Curso, CursoSchema } from './schemas/cursos.schema';
import { Usuario, UsuarioSchema } from '../Usuarios/schemas/usuarios.schema'; // Importar el modelo de Usuario

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Curso.name, schema: CursoSchema },
      { name: Usuario.name, schema: UsuarioSchema } // Añadir el modelo de Usuario al módulo
    ])
  ],
  controllers: [CursosController],
  providers: [CursosService],
})
export class CursosModule {}
