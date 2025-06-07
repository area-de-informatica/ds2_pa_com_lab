//schemas/activity.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Actividad extends Document{
    @Prop()
    type: string;

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    title: string;   

     @Prop()
    link: string; 
    
    @Prop()
    status: string;   

}

export const ActividadSchema = SchemaFactory.createForClass(Actividad);