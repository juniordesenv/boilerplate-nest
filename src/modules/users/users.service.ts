import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserModel,
  LoadUserByEmailRepository,
  LoadUserByIdRepository,
  CreateUserRepository,
  ConfirmEmailUserRepository,
} from '~/modules/users/interfaces';
import { CreateUserDto } from '~/modules/users/dto';

@Injectable()
export class UsersService implements
LoadUserByEmailRepository,
LoadUserByIdRepository,
CreateUserRepository,
ConfirmEmailUserRepository {
  constructor(@InjectModel('User') private userModel: Model<UserModel>) {}

  async loadById(_id: string): Promise<UserModel> {
    return this.userModel.findOne({ _id }).exec();
  }

  async loadByEmail(email: string, verifiedEmail?: boolean | undefined): Promise<UserModel> {
    return this.userModel.findOne({ email, verifiedEmail }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    return this.userModel.create(createUserDto);
  }

  confirmEmail(token: string): Promise<UserModel> {
    return this.userModel.findOneAndUpdate({
      confirmToken: token,
    },
    {
      $set: {
        verifiedEmail: true,
      },
    },
    { new: true });
  }
}
