import { Injectable } from '@nestjs/common';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { Archivo } from './schemas/archivos.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ArchivoSchema } from './schemas/archivos.schema';

@Injectable()
export class ArchivosService {
  constructor(@InjectModel(Archivo.name) private archivoModel: Model<Archivo>) {}

  async create(createArchivoDto: CreateArchivoDto): Promise<Archivo> {
    const createdArchivo = new this.archivoModel(createArchivoDto);
    return createdArchivo.save();
  }

  async findAll(): Promise<Archivo[]> {
    return this.archivoModel.find().exec();
  }

  async findOne(id: string): Promise<Archivo | null> {
    return this.archivoModel.findById(id).exec();
  }

  async update(id: string, updateArchivoDto: UpdateArchivoDto): Promise<Archivo | null> {
    return this.archivoModel.findByIdAndUpdate(id, updateArchivoDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Archivo | null> {
    return this.archivoModel.findByIdAndDelete(id).exec()
}
}
