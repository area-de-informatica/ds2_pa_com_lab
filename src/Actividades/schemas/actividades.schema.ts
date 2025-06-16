//schemas/activity.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Entrega } from '../../Entregas/schemas/entregas.schema'
import { Archivo } from '../../Archivos/schemas/archivos.schema'

@Schema({
    timestamps: true
})

export class Actividad extends Document{
    @Prop()
    type: string;

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    title: string;   

     @Prop()
    link: string; 
    
    @Prop()
    status: string;   

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Entrega' }])
    entregas: Entrega[]

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Archivo' }])
    archivos: Archivo[]
}

export const ActividadSchema = SchemaFactory.createForClass(Actividad);