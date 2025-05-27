import { Injectable } from '@nestjs/common';
import { CreateContenidoDto } from './dto/create-contenido.dto';
import { UpdateContenidoDto } from './dto/update-contenido.dto';

@Injectable()
export class ContenidosService {
  create(createContenidoDto: CreateContenidoDto) {
    return 'This action adds a new contenido';
  }

  findAll() {
    return `This action returns all contenidos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contenido`;
  }

  update(id: number, updateContenidoDto: UpdateContenidoDto) {
    return `This action updates a #${id} contenido`;
  }

  remove(id: number) {
    return `This action removes a #${id} contenido`;
  }
}
