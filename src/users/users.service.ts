import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel, LoadUserByEmailRepository, CreateUserRepository } from '~/interfaces/users';
import { CreateUserDto } from '~/dto/users/create-user.dto';

@Injectable()
export class UsersService implements
LoadUserByEmailRepository,
CreateUserRepository {
  constructor(@InjectModel('User') private userModel: Model<UserModel>) {}

  async loadByEmail(email: string): Promise<UserModel | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    return this.userModel.create(createUserDto);
  }
}
