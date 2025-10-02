import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; // Importar AuthModule
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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // --- Configuración de variables de entorno
    ConfigModule.forRoot({ isGlobal: true }),

    // --- Conexión a MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
      }),
    }),

    // --- Servir archivos estáticos desde carpeta /public
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // busca index.html en /public
    }),

    // --- Módulo de autenticación
    AuthModule, // Añadir AuthModule aquí

    // --- Tus módulos de la app
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
