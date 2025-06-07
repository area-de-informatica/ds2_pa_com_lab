import { Module } from '@nestjs/common';
import { ArchivosService } from './archivos.service';
import { ArchivosController } from './archivos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ArchivoSchema } from './schemas/archivos.schema';

@Module({
  imports :[
  MongooseModule.forFeature([{ name: 'Archivo', schema: ArchivoSchema }])
  ],
  controllers: [ArchivosController],
  providers: [ArchivosService],
})
export class ArchivosModule {}
