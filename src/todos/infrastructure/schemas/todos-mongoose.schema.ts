import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { setTimestampsTzOnCreateMdw } from '@shared/infrastructure/middlewares/set-timestamps-tz-on-save.mdw';
import { setTimestampsTzOnUpdateMdw } from '@shared/infrastructure/middlewares/set-timestamps-tz-on-update.mdw';
import { ObjectId } from 'bson';
import { Document } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class TodosMongooseDocument extends Document {
  @Prop({ required: true, type: String }) public title: string;
  @Prop({ required: false, type: String }) public description?: string;
  @Prop({ required: true, type: Boolean, default: false }) public completed: boolean;
  @Prop({ required: false, type: Date }) public due_date?: Date;
  @Prop({ required: false, type: String, enum: ['low', 'medium', 'high'] }) public priority?: 'low' | 'medium' | 'high';
  @Prop({ required: false, type: ObjectId }) public user_id?: ObjectId;
  @Prop({ type: Boolean, default: false }) public is_deleted: boolean;
  @Prop({ type: Date }) public created_at?: Date;
  @Prop({ type: Date }) public updated_at?: Date;
}

const schema = SchemaFactory.createForClass(TodosMongooseDocument);
schema.pre('save', setTimestampsTzOnCreateMdw);
schema.pre('findOneAndUpdate', setTimestampsTzOnUpdateMdw);

export { schema as TodosMongooseSchema };
