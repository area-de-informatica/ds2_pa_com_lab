import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Curso } from '../../Cursos/schemas/cursos.schema'

@Schema({
    timestamps: true
})

export class Usuario extends Document{
    @Prop()
    username: string;

    @Prop({ unique: [true, 'Email already exists'] })
    email: string;

    @Prop({default: 'guest'})
    role: string;
    
    @Prop()
    phone: string;
    
    @Prop()
    password: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }])
    cursos: Curso[]
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
