
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Curso, CursoSchema } from '../Cursos/schemas/cursos.schema';
import { Usuario, UsuarioSchema } from '../Usuarios/schemas/usuarios.schema';
import { Unidades, UnidadeSchema } from '../Unidades/schemas/unidades.schema'; // CORREGIDO

const MODELS = [
  { name: Usuario.name, schema: UsuarioSchema },
  { name: Curso.name, schema: CursoSchema },
  { name: Unidades.name, schema: UnidadeSchema }, // CORREGIDO
];

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'), // Asegúrate de que DB_URI está en tu .env
      }),
    }),
    MongooseModule.forFeature(MODELS),
  ],
  exports: [MongooseModule], // Exportar MongooseModule para que los modelos inyectados estén disponibles
})
export class DatabaseModule {}
