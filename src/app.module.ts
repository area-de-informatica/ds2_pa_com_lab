import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CursosModule } from './cursos/cursos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ContenidosModule } from './contenidos/contenidos.module';
import { ForoModule } from './foro/foro.module';
import { RespuestasModule } from './respuestas/respuestas.module';
import { LeccionesModule } from './lecciones/lecciones.module';
import { ActividadesModule } from './actividades/actividades.module';
import { UnidadesModule } from './unidades/unidades.module';
import { EntregasModule } from './entregas/entregas.module';
import { ArchivosModule } from './archivos/archivos.module';

@Module({
  imports: [CursosModule, UsuariosModule, ContenidosModule, ForoModule, RespuestasModule, LeccionesModule, ActividadesModule, UnidadesModule, EntregasModule, ArchivosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
