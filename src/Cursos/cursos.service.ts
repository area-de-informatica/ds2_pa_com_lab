import { Injectable } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './schemas/cursos.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CursoSchema } from './schemas/cursos.schema';

@Injectable()
export class CursosService {
  constructor(@InjectModel(Curso.name) private cursoModel: Model<Curso>) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const createdCurso = new this.cursoModel(createCursoDto);
    return createdCurso.save();
  }

  async findAll(): Promise<Curso[]> {
    return this.cursoModel.find().exec();
  }

  async findOne(id: string): Promise<Curso | null> {
    return this.cursoModel.findById(id).exec();
  }

  async update(id: string, updateCursoDto: UpdateCursoDto): Promise<Curso | null> {
    return this.cursoModel.findByIdAndUpdate(id, updateCursoDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Curso | null> {
    return this.cursoModel.findByIdAndDelete(id).exec()
}
}