import { Injectable } from '@nestjs/common';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UnidadeSchema } from './schemas/unidades.schema';
import { Unidade } from './entities/unidade.entity';

@Injectable()
export class UnidadesService {
  constructor(@InjectModel(Unidade.name) private unidadeModel: Model<Unidade>) {}

  async create(createUnidadeDto: CreateUnidadeDto): Promise<Unidade> {
    const createdUnidade = new this.unidadeModel(createUnidadeDto);
    return createdUnidade.save();
  }

  async findAll(): Promise<Unidade[]> {
    return this.unidadeModel.find().exec();
  }

  async findOne(id: string): Promise<Unidade | null> {
    return this.unidadeModel.findById(id).exec();
  }

  async update(id: string, updateUnidadeDto: UpdateUnidadeDto): Promise<Unidade | null> {
    return this.unidadeModel.findByIdAndUpdate(id, updateUnidadeDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Unidade | null> {
    return this.unidadeModel.findByIdAndDelete(id).exec()
}
}