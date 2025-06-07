import { Injectable } from '@nestjs/common';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { Actividad } from './schemas/actividades.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ActividadSchema } from './schemas/actividades.schema';

@Injectable()
export class ActividadesService {
  constructor(@InjectModel(Actividad.name) private actividadModel: Model<Actividad>) {}

  async create(createActividadDto: CreateActividadDto): Promise<Actividad> {
    const createdActividad = new this.actividadModel(createActividadDto);
    return createdActividad.save();
  }

  async findAll(): Promise<Actividad[]> {
    return this.actividadModel.find().exec();
  }

  async findOne(id: string): Promise<Actividad | null> {
    return this.actividadModel.findById(id).exec();
  }

  async update(id: string, updateArchivoDto: UpdateActividadDto): Promise<Actividad | null> {
    return this.actividadModel.findByIdAndUpdate(id, UpdateActividadDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Actividad | null> {
    return this.actividadModel.findByIdAndDelete(id).exec()
}
}
