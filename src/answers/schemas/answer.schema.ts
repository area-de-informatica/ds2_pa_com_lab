//schemas/answer.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Answer extends Document{
    @Prop()
    message: string;  
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);