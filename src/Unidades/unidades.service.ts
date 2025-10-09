// src/Unidades/unidades.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnidadesDto } from './dto/create-unidade.dto';
import { UpdateUnidadesDto } from './dto/update-unidade.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Unidades } from './schemas/unidades.schema';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectModel(Unidades.name) private unidadeModel: Model<Unidades>,
  ) {}

  // El método create ahora es mucho más simple. 
  // Solo se encarga de crear el documento de la unidad.
  async create(createUnidadeDto: CreateUnidadesDto): Promise<Unidades> {
    const createdUnidade = new this.unidadeModel(createUnidadeDto);
    return createdUnidade.save();
  }

  async findAll(): Promise<Unidades[]> {
    return this.unidadeModel.find().populate('Contenidos').populate('Lecciones').exec();
  }

  async findOne(id: string): Promise<Unidades | null> {
    return this.unidadeModel.findById(id).populate('Contenidos').populate('Lecciones').exec();
  }

  async findUnidadesContenido(Id: string): Promise<Unidades | null> {
    return this.unidadeModel.findById(Id).populate('Contenidos').exec();
  }

  async findUnidadesLecciones(Id: string): Promise<Unidades | null> {
    return this.unidadeModel.findById(Id).populate('Lecciones').exec();
  }
  
  async update(id: string, updateUnidadeDto: UpdateUnidadesDto): Promise<Unidades | null> {
    return this.unidadeModel.findByIdAndUpdate(id, updateUnidadeDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Unidades | null> {
    return this.unidadeModel.findByIdAndDelete(id).exec();
  }
}
