//schemas/folder.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Archivo extends Document{
    @Prop()
    name: string;

    @Prop()
    format: string; 

    @Prop()
    route: string; 

    @Prop()
    size: string;
    
    @Prop()
    extent: string;

    @Prop()
    order: string;

    @Prop()
    type: string;
    
    @Prop()
    title: string;
}

export const ArchivoSchema = SchemaFactory.createForClass(Archivo);