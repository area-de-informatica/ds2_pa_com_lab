//schemas/lesson.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Lesson extends Document{
    @Prop()
    name: string;

    @Prop()
    category: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);