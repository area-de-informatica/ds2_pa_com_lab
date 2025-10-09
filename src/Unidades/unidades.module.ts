import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnidadesService } from './unidades.service';
import { UnidadesController } from './unidades.controller';
import { Unidades, UnidadeSchema } from './schemas/unidades.schema';
import { Curso, CursoSchema } from '../Cursos/schemas/cursos.schema'; // Corregido: Curso en singular

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Unidades.name, schema: UnidadeSchema },
      { name: Curso.name, schema: CursoSchema } // Corregido: Curso en singular
    ])
  ],
  controllers: [UnidadesController],
  providers: [UnidadesService],
})
export class UnidadesModule {}
