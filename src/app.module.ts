import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './Usuarios/usuarios.module';
import { CursosModule } from './courses/cursos.module';
import { ForoModule } from './Foro/foro.module';
import { ContenidosModule } from './contents/contenidos.module';
import { LeccionesModule } from './Lecciones/lecciones.module';
import { ActividadesModule } from './activities/actividades.module';
import { RespuestasModule } from './answers/respuestas.module';
import { EntregasModule } from './deliveries/entregas.module';
import { UnidadesModule } from './Unidades/unidades.module';
import { ArchivosModule } from './Archivos/archivos.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: process.env.DB_URI,
      }),
      inject: [],
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

