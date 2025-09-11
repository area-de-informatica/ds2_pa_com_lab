import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './Usuarios/usuarios.module';
import { CursosModule } from './Cursos/cursos.module';
import { ForoModule } from './Foro/foro.module';
import { ContenidosModule } from './Contenidos/contenidos.module';
import { LeccionesModule } from './Lecciones/lecciones.module';
import { ActividadesModule } from './Actividades/actividades.module';
import { RespuestasModule } from './Respuestas/respuestas.module';
import { EntregasModule } from './Entregas/entregas.module';
import { UnidadesModule } from './Unidades/unidades.module';
import { ArchivosModule } from './Archivos/archivos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
      }),
    }),
    UsuariosModule, 
    CursosModule, 
    ForoModule, 
    ContenidosModule, 
    LeccionesModule, 
    ActividadesModule, 
    RespuestasModule, 
    EntregasModule, 
    UnidadesModule, 
    ArchivosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

