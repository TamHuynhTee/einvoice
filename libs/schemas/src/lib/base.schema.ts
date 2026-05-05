import { Type } from '@nestjs/common';
import { Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import type { Schema as MongooseSchema } from 'mongoose';

export class BaseSchema {
  _id: ObjectId;

  @Virtual({ get: (doc) => doc._id.toString() })
  id: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const createSchema = <TClass = BaseSchema>(target: Type<TClass>): MongooseSchema<TClass> => {
  const schema = SchemaFactory.createForClass(target);
  schema.set('toJSON', {
    virtuals: true,
  });
  schema.set('toObject', {
    virtuals: true,
  });

  schema.set('timestamps', true);
  schema.set('versionKey', false);

  return schema;
};
