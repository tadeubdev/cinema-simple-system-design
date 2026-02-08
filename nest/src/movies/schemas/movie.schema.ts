import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Movie extends Document {
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({ type: String })
  description: string | null;

  @Prop({ type: Number })
  duration_min: number | null;

  @Prop({ type: Date })
  date_start: Date | null;

  @Prop({ type: Date })
  date_end: Date | null;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
