import { Module } from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { UnidadesController } from './unidades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UnidadeSchema } from './schemas/unidades.schema';

@Module({
  imports :[
  MongooseModule.forFeature([{ name: 'Unidade', schema: UnidadeSchema }])
  ],
  controllers: [UnidadesController],
  providers: [UnidadesService],
})
export class UnidadesModule {}
