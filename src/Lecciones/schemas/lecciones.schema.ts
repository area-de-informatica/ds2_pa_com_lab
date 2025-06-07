//schemas/lecciones.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Leccione extends Document{
    @Prop()
    name: string;

    @Prop()
    category: string;
}

export const LeccioneSchema = SchemaFactory.createForClass(Leccione);