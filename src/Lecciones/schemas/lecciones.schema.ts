//schemas/lecciones.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Unidades } from '../../Unidades/schemas/unidades.schema'

@Schema({
    timestamps: true
})

export class Lecciones extends Document{
    @Prop()
    name: string;

    @Prop()
    category: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Unidades' }])
    Unidades: Unidades[]
}

export const LeccioneSchema = SchemaFactory.createForClass(Lecciones);