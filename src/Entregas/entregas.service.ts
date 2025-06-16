import { Injectable } from '@nestjs/common';
import { CreateEntregaDto } from './dto/create-entregas.dto';
import { UpdateEntregaDto } from './dto/update-entregas.dto';
import { Entrega } from './schemas/entregas.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EntregaSchema } from './schemas/entregas.schema';

@Injectable()
export class EntregasService {
  constructor(@InjectModel(Entrega.name) private entregaModel: Model<Entrega>) {}

  async create(createEntregaDto: CreateEntregaDto): Promise<Entrega> {
    const createdEntrega = new this.entregaModel(createEntregaDto);
    return createdEntrega.save();
  }

  async findAll(): Promise<Entrega[]> {
    return this.entregaModel.find().populate('usuarios').exec();
  }

  async findOne(id: string): Promise<Entrega | null> {
    return this.entregaModel.findById(id).populate('usuarios').exec();
  }

  async findEntregaUsuarios(Id: string): Promise<Entrega | null> {
    return this.entregaModel.findById(Id).populate('usuarios').exec();
  }

  async update(id: string, updateEntregaDto: UpdateEntregaDto): Promise<Entrega | null> {
    return this.entregaModel.findByIdAndUpdate(id, updateEntregaDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Entrega | null> {
    return this.entregaModel.findByIdAndDelete(id).exec()
}
}
