//schemas/unity.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Unit extends Document{
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

export const UnitySchema = SchemaFactory.createForClass(Unit);