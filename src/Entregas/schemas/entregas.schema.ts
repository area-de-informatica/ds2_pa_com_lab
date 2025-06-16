//schemas/delivery.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Usuario } from '../../Usuarios/schemas/usuarios.schema'
import { Actividad } from '../../Actividades/schemas/actividades.schema'

@Schema({
    timestamps: true
})

export class Entrega extends Document{
    @Prop()
    delivery_date: string;

    @Prop()
    hour: string;

    @Prop()
    comment: string;   

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }])
    usuarios: Usuario[]

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Actividad' }])
    actividades: Actividad[]
}

export const EntregaSchema = SchemaFactory.createForClass(Entrega);