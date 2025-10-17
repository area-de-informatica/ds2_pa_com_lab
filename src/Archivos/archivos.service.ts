import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { Archivo } from './schemas/archivos.schema';
import { Contenidos } from '../Contenidos/schemas/contenidos.schema';
import { Unidades } from '../Unidades/schemas/unidades.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ArchivosService {
  constructor(
    @InjectModel(Archivo.name) private archivoModel: Model<Archivo>,
    @InjectModel(Contenidos.name) private contenidoModel: Model<Contenidos>,
    @InjectModel(Unidades.name) private unidadModel: Model<Unidades>,
  ) {}

  async create(idUnidad: string, createArchivoDto: CreateArchivoDto, file: Express.Multer.File): Promise<Archivo> {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    const filePath = path.join(uploadPath, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    const fileUrl = `/uploads/${file.originalname}`;

    const createdArchivo = new this.archivoModel({
      name: createArchivoDto.name,
      title: createArchivoDto.description,
      route: fileUrl,
      format: file.mimetype,
      size: file.size.toString(),
      extent: path.extname(file.originalname),
    });
    const savedArchivo = await createdArchivo.save();

    const newContenido = new this.contenidoModel({
      title: savedArchivo.name, 
      description: createArchivoDto.description,
      archivo: savedArchivo._id, 
      unidad: idUnidad,
    });
    const savedContenido = await newContenido.save();

    const unidad = await this.unidadModel.findById(idUnidad);
    if (!unidad) {
      throw new NotFoundException(`No se encontró la unidad con el id ${idUnidad}`);
    }
    unidad.Contenidos.push(savedContenido.id);
    await unidad.save();

    return savedArchivo;
  }

  async findAll(): Promise<Archivo[]> {
    return this.archivoModel.find().populate('entregas').populate('actividades').populate('lecciones').exec();
  }

  async findOne(id: string): Promise<Archivo | null> {
    return this.archivoModel.findById(id).populate('entregas').populate('actividades').populate('lecciones').exec();
  }

  async findArchivosEntrega(userId: string): Promise<Archivo | null> {
    return this.archivoModel.findById(userId).populate('entregas').exec();
  }

  async findArchivosActividad(userId: string): Promise<Archivo | null> {
    return this.archivoModel.findById(userId).populate('actividades').exec();
  }

  async findArchivosLecciones(userId: string): Promise<Archivo | null> {
    return this.archivoModel.findById(userId).populate('lecciones').exec();
  }

  async update(id: string, updateArchivoDto: UpdateArchivoDto): Promise<Archivo | null> {
    return this.archivoModel.findByIdAndUpdate(id, updateArchivoDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Archivo | null> {
    return this.archivoModel.findByIdAndDelete(id).exec()
  }
}
