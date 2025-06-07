import { Module } from '@nestjs/common';
import { ContenidosService } from './contenidos.service';
import { ContenidosController } from './contenidos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContenidoSchema } from './schemas/contenidos.schema';

@Module({
  imports :[
  MongooseModule.forFeature([{ name: 'Contenido', schema: ContenidoSchema }])
  ],
  controllers: [ContenidosController],
  providers: [ContenidosService],
})
export class ContenidosModule {}
