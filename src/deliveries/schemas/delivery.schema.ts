//schemas/delivery.schema.ts


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
})

export class Delivery extends Document{
    @Prop()
    delivery_date: string;

    @Prop()
    hour: string;

    @Prop()
    note: string;

    @Prop()
    comment: string;   
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);