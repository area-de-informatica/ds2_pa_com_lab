import { Injectable } from '@nestjs/common';
import { CreateLeccioneDto } from './dto/create-leccione.dto';
import { UpdateLeccioneDto } from './dto/update-leccione.dto';
import { Leccione } from './schemas/lecciones.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LeccioneSchema } from './schemas/lecciones.schema';

@Injectable()
export class LeccionesService {
  constructor(@InjectModel(Leccione.name) private leccioneModel: Model<Leccione>) {}

  async create(createLeccioneDto: CreateLeccioneDto): Promise<Leccione> {
    const createdLeccione = new this.leccioneModel(createLeccioneDto);
    return createdLeccione.save();
  }

  async findAll(): Promise<Leccione[]> {
    return this.leccioneModel.find().exec();
  }

  async findOne(id: string): Promise<Leccione | null> {
    return this.leccioneModel.findById(id).exec();
  }

  async update(id: string, updateLeccioneDto: UpdateLeccioneDto): Promise<Leccione | null> {
    return this.leccioneModel.findByIdAndUpdate(id, updateLeccioneDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Leccione | null> {
    return this.leccioneModel.findByIdAndDelete(id).exec()
}
}