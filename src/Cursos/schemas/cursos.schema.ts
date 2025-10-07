// src/Cursos/schemas/cursos.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';
// Haremos referencia al Schema de Usuario para la relación de inscritos
import { Usuario } from '../../Usuarios/schemas/usuarios.schema';

@Schema({
    timestamps: true // Esto añade automáticamente createdAt y updatedAt
})
export class Curso extends Document {
    @Prop({
        required: true,
        trim: true, // Limpia espacios en blanco al inicio y final
    })
    nombre: string;

    @Prop({
        required: true,
        trim: true,
    })
    descripcion: string;

    @Prop()
    porcentaje: number; // El porcentaje debería ser un número

    @Prop()
    fecha_inicio: Date; // Usar el tipo Date para las fechas

    @Prop()
    fecha_fin: Date; // Usar el tipo Date para las fechas
    
    // Esta es la relación n:n con Usuarios (los inscritos en el curso)
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }])
    inscritos: Usuario[]; // Cambiado 'usuarios' a 'inscritos' para más claridad
}

export const CursoSchema = SchemaFactory.createForClass(Curso);