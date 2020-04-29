import { pre, prop } from '@typegoose/typegoose';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

@pre<User>('save', function (next) {
  const user = this;
  if (!user._id) user.confirmToken = v4();
  if (user.password) {
    bcrypt.genSalt(9, (err, salt) => {
      if (err) next(err);
      else {
        bcrypt.hash(user.password, salt, (err2, hash) => {
          if (err2) next(err2);
          else {
            user.password = hash;
            next();
          }
        });
      }
    });
  }
})
export class User {
  _id?: string;

  @IsString()
  @prop({ required: true })
  name!: string;

  @IsString()
  @IsEmail()
  @prop({
    required: true,
    lowercase: true,
    email: true,
    trim: true,
    unique: true,
  })
  email!: string;

  @IsString()
  @prop({ required: true })
  password!: string;

  @IsBoolean()
  @prop({ required: false })
  verifiedEmail?: boolean;

  @IsString()
  @prop({ required: false })
  confirmToken?: string;
}
