import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersService } from './users.service';
import { User } from '~/modules/users/model/user.model';

@Module({
  imports: [TypegooseModule.forFeature([{
    typegooseClass: User,
    schemaOptions: {
      timestamps: true,
      toObject: {
        transform(doc: any, ret: any) {
          // eslint-disable-next-line no-param-reassign
          delete ret.password;
        },
      },
      toJSON: {
        transform(doc: any, ret: any) {
          // eslint-disable-next-line no-param-reassign
          delete ret.password;
          // eslint-disable-next-line no-param-reassign
          delete ret.confirmToken;
        },
      },
    },
  }])],
  controllers: [],
  providers: [
    UsersService],
  exports: [UsersService],
})
export class UsersModule {}
