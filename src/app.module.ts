import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
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
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // 1. Servir archivos de la carpeta 'uploads' en la ruta /uploads
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // 2. Servir la aplicación principal de frontend
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    DatabaseModule,

    AuthModule,
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
