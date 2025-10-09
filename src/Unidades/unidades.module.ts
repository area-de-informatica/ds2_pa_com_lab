import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnidadesService } from './unidades.service';
import { UnidadesController } from './unidades.controller';
import { Unidades, UnidadeSchema } from './schemas/unidades.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Unidades.name, schema: UnidadeSchema },
    ])
  ],
  controllers: [UnidadesController],
  providers: [UnidadesService],
  exports: [UnidadesService]
})
export class UnidadesModule {}
