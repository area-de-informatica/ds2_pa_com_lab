import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

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
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);