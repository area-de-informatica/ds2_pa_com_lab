//schemas/forum.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Forum extends Document{
    @Prop()
    issue: string;

    @Prop()
    description: string;

    @Prop()
    category: string; 
}

export const ForumSchema = SchemaFactory.createForClass(Forum);