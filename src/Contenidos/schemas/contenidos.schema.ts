//schemas/content.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Contenido extends Document{
    @Prop()
    title: string;

    @Prop()
    description: string; 
}

export const ContenidoSchema = SchemaFactory.createForClass(Contenido);