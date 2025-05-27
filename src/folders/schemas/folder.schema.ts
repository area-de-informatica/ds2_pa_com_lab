//schemas/folder.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Folders extends Document{
    @Prop()
    name: string;

    @Prop()
    format: string; 

    @Prop()
    route: string; 

    @Prop()
    weigth: string;
    
    @Prop()
    scale: string;

    @Prop()
    order: string;

    @Prop()
    type: string;
    
    @Prop()
    title: string;
}

export const FoldersSchema = SchemaFactory.createForClass(Folders);