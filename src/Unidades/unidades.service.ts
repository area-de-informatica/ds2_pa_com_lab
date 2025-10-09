import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnidadesDto } from './dto/create-unidade.dto';
import { UpdateUnidadesDto } from './dto/update-unidade.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Unidades } from './schemas/unidades.schema';
import { Curso } from '../Cursos/schemas/cursos.schema'; // Importar el modelo de Curso

@Injectable()
export class UnidadesService {
  // Inyectar ambos modelos
  constructor(
    @InjectModel(Unidades.name) private unidadeModel: Model<Unidades>,
    @InjectModel(Curso.name) private cursoModel: Model<Curso>
  ) {}

  async create(createUnidadeDto: CreateUnidadesDto): Promise<Unidades> {
    const { cursoId, ...unidadData } = createUnidadeDto;

    // 1. Verificar que el curso existe
    const curso = await this.cursoModel.findById(cursoId);
    if (!curso) {
      throw new NotFoundException(`Curso con ID "${cursoId}" no encontrado`);
    }

    // 2. Crear la unidad
    const createdUnidade = new this.unidadeModel(unidadData);
    const savedUnidad = await createdUnidade.save();

    // 3. Añadir la nueva unidad al array de unidades del curso
    curso.unidades.push(savedUnidad.id); // Añadimos el ID de la nueva unidad
    await curso.save();

    return savedUnidad;
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
    // Opcional: También se podría eliminar la referencia en el array del curso
    return this.unidadeModel.findByIdAndDelete(id).exec();
  }
}
