//schemas/unity.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Unidades extends Document{
    @Prop()
    name: string;

    @Prop()
    order: string;

    @Prop()
    category: string;

    @Prop()
    title: string;

    @Prop()
    text: string;  
}

export const UnidadeSchema = SchemaFactory.createForClass(Unidades);