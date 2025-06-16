import { Injectable } from '@nestjs/common';
import { CreateLeccionesDto } from './dto/create-leccione.dto';
import { UpdateLeccionesDto } from './dto/update-leccione.dto';
import { Lecciones } from './schemas/lecciones.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LeccioneSchema } from './schemas/lecciones.schema';

@Injectable()
export class LeccionesService {
  constructor(@InjectModel(Lecciones.name) private leccioneModel: Model<Lecciones>) {}

  async create(createLeccioneDto: CreateLeccionesDto): Promise<Lecciones> {
    const createdLeccione = new this.leccioneModel(createLeccioneDto);
    return createdLeccione.save();
  }

  async findAll(): Promise<Lecciones[]> {
    return this.leccioneModel.find().populate('Unidades').exec();
  }

  async findOne(id: string): Promise<Lecciones | null> {
    return this.leccioneModel.findById(id).populate('Unidades').exec();
  }

  async findLeccionesUnidades(Id: string): Promise<Lecciones | null> {
    return this.leccioneModel.findById(Id).populate('Unidades').exec();
  }

  async update(id: string, updateLeccioneDto: UpdateLeccionesDto): Promise<Lecciones | null> {
    return this.leccioneModel.findByIdAndUpdate(id, updateLeccioneDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Lecciones | null> {
    return this.leccioneModel.findByIdAndDelete(id).exec()
}
}