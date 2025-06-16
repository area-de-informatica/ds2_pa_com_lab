import { Injectable } from '@nestjs/common';
import { CreateUnidadesDto } from './dto/create-unidade.dto';
import { UpdateUnidadesDto } from './dto/update-unidade.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UnidadeSchema } from './schemas/unidades.schema';
import { Unidades } from './entities/unidade.entity';

@Injectable()
export class UnidadesService {
  constructor(@InjectModel(Unidades.name) private unidadeModel: Model<Unidades>) {}

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
    return this.unidadeModel.findByIdAndDelete(id).exec()
}
}