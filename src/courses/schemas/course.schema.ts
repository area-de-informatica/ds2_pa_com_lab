//schemas/course.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Course extends Document{
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    percentage: string;

    @Prop()
    start_date: string;   

     @Prop()
    end_date: string;   
}

export const CourseSchema = SchemaFactory.createForClass(Course);