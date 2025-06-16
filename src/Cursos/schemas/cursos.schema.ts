//schemas/course.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Usuario } from '../../Usuarios/schemas/usuarios.schema'

@Schema({
    timestamps: true
})

export class Curso extends Document{
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    percentage: string;

    @Prop()
    start_date: string;   

     @Prop()
    end_date: string;  
    
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }])
    usuarios: Usuario[]
}

export const CursoSchema = SchemaFactory.createForClass(Curso);