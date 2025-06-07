import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CursoSchema } from './schemas/cursos.schema';

@Module({
  imports :[
  MongooseModule.forFeature([{ name: 'Curso', schema: CursoSchema }])
  ],
  controllers: [CursosController],
  providers: [CursosService],
})
export class CursosModule {}
