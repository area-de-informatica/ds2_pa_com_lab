import { Injectable } from '@nestjs/common';
import { CreateContenidoDto } from './dto/create-contenido.dto';
import { UpdateContenidoDto } from './dto/update-contenido.dto';
import { Contenido } from './schemas/contenidos.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ContenidoSchema } from './schemas/contenidos.schema';

@Injectable()
export class ContenidosService {
  constructor(@InjectModel(Contenido.name) private contenidoModel: Model<Contenido>) {}

  async create(createContenidoDto: CreateContenidoDto): Promise<Contenido> {
    const createdContenido = new this.contenidoModel(createContenidoDto);
    return createdContenido.save();
  }

  async findAll(): Promise<Contenido[]> {
    return this.contenidoModel.find().exec();
  }

  async findOne(id: string): Promise<Contenido | null> {
    return this.contenidoModel.findById(id).exec();
  }

  async update(id: string, updateCursoDto: UpdateContenidoDto): Promise<Contenido | null> {
    return this.contenidoModel.findByIdAndUpdate(id, UpdateContenidoDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Contenido | null> {
    return this.contenidoModel.findByIdAndDelete(id).exec()
}
}