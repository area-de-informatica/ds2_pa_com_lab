import { Injectable } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './schemas/cursos.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CursosService {
  // Inyectamos el modelo de Mongoose para poder interactuar con la colección de Cursos
  constructor(@InjectModel(Curso.name) private cursoModel: Model<Curso>) {}

  // --- CREAR un nuevo curso ---
  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const createdCurso = new this.cursoModel(createCursoDto);
    return createdCurso.save();
  }

  // --- OBTENER todos los cursos ---
  async findAll(): Promise<Curso[]> {
    // Usamos .populate('inscritos') para traer la información de los usuarios inscritos, no solo sus IDs
    return this.cursoModel.find().populate('inscritos').exec();
  }

  // --- OBTENER un curso por su ID ---
  async findOne(id: string): Promise<Curso | null> {
    return this.cursoModel.findById(id).populate('inscritos').exec();
  }

  // --- ACTUALIZAR un curso por su ID ---
  async update(id: string, updateCursoDto: UpdateCursoDto): Promise<Curso | null> {
    // { new: true } nos asegura que la función devuelva el documento actualizado
    return this.cursoModel.findByIdAndUpdate(id, updateCursoDto, { new: true }).exec();
  }

  // --- ELIMINAR un curso por su ID ---
  async remove(id: string): Promise<Curso | null> {
    return this.cursoModel.findByIdAndDelete(id).exec();
  }
}
