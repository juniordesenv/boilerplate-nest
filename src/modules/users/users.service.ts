import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserModel,
  LoadUserByEmailRepository,
  LoadUserByIdRepository,
  CreateUserRepository,
} from '~/modules/users/interfaces';
import { CreateUserDto } from '~/modules/users/dto';

@Injectable()
export class UsersService implements
LoadUserByEmailRepository,
LoadUserByIdRepository,
CreateUserRepository {
  constructor(@InjectModel('User') private userModel: Model<UserModel>) {}

  async loadById(_id: string): Promise<UserModel> {
    return this.userModel.findOne({ _id }).exec();
  }

  async loadByEmail(email: string): Promise<UserModel> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    return this.userModel.create(createUserDto);
  }
}
