import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CursosModule } from './cursos/cursos.module';
import { ForoModule } from './foro/foro.module';
import { ContenidosModule } from './contenidos/contenidos.module';
import { LeccionesModule } from './lecciones/lecciones.module';
import { ActividadesModule } from './actividades/actividades.module';
import { RespuestasModule } from './respuestas/respuestas.module';
import { EntregasModule } from './entregas/entregas.module';
import { UnidadesModule } from './unidades/unidades.module';
import { ArchivosModule } from './archivos/archivos.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';



@Module({
  imports: [
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri:"mongodb+srv://adminpardy:3rK25CowNngHMDDv@cluster0.hkvcyov.mongodb.net/db_complab?retryWrites=true&w=majority&appName=Cluster0",
      }),
      inject: [],
      
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}