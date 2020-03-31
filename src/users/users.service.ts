import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserModel,
  LoadUserByEmailRepository,
  LoadUserByIdRepository,
  CreateUserRepository,
} from '~/interfaces/users';
import { CreateUserDto } from '~/dto/users/create-user.dto';

@Injectable()
export class UsersService implements
LoadUserByEmailRepository,
LoadUserByIdRepository,
CreateUserRepository {
  constructor(@InjectModel('User') private userModel: Model<UserModel>) {}

  loadById(_id: string): Promise<UserModel> {
    return this.userModel.findOne({ _id }).exec();
  }

  async loadByEmail(email: string): Promise<UserModel> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    return this.userModel.create(createUserDto);
  }
}
