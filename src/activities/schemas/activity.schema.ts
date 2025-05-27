//schemas/activity.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Activities extends Document{
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
    state: string;   
}

export const ActivitySchema = SchemaFactory.createForClass(Activities);