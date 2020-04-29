import { v4 } from 'uuid';
import { addHours } from 'date-fns';
import { pre, prop, Ref } from '@typegoose/typegoose';
import { IsString } from 'class-validator';
import { User } from '~/modules/users/model/user.model';

@pre<ResetPassword>('save', function (next) {
  const resetPassword = this;
  resetPassword.token = v4();
  resetPassword.expiredAt = addHours(new Date(), 8);
  next();
})
export class ResetPassword {
  @prop({ required: true, ref: User })
  user!: Ref<User>;

  @IsString()
  @prop({
    required: false,
  })
  token?: string;

  @prop({ required: false })
  usedIn?: Date;

  @prop({ required: false })
  expiredAt?: Date;
}
