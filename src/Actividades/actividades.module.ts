import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ActividadSchema } from './schemas/actividades.schema';

@Module({
  imports :[
  MongooseModule.forFeature([{ name: 'Actividad', schema: ActividadSchema }])
  ],
  controllers: [ActividadesController],
  providers: [ActividadesService],
})
export class ActividadesModule {}
