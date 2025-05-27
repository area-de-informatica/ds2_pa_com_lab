import { Module } from '@nestjs/common';
import { ContenidosService } from './contenidos.service';
import { ContenidosController } from './contenidos.controller';

@Module({
  controllers: [ContenidosController],
  providers: [ContenidosService],
})
export class ContenidosModule {}
