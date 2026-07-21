import { Prop, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseSchema, createSchema } from './base.schema';
import { PERMISSION, ROLE } from '@common/constants/enum/role.enum';

@Schema({
  collection: 'role',
})
export class Role extends BaseSchema {
  @Prop({ type: String, enum: ROLE, default: ROLE.ACCOUNTANT })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [String], enum: PERMISSION, default: [] })
  permissions: PERMISSION[];
}

export const RoleSchema = createSchema(Role);
export const RoleModelName = Role.name;
export const RoleDestination = {
  name: RoleModelName,
  schema: RoleSchema,
};

export type RoleModel = Model<Role>;
