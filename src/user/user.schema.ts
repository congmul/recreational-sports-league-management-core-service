import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user.enum';

// timestamps option can create createdAt / updatedAt automatically
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique:true, required: true })
  email: string;
  
  @Prop({ required: true })
  password: string;
  
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ enum: UserRole })
  role: UserRole
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
    const user = this;
      // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the salt
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (err) {
        next(err);
    }
})

// Method to compare password for authentication
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};
