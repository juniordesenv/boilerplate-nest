import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import {
  LoadUserByEmailRepository,
  LoadUserByIdRepository,
  CreateUserRepository,
  ConfirmEmailUserRepository,
} from '~/modules/users/interfaces';
import { CreateUserDto } from '~/modules/users/dto';
import { User } from '~/modules/users/model/user.model';

@Injectable()
export class UsersService implements
LoadUserByEmailRepository,
LoadUserByIdRepository,
CreateUserRepository,
ConfirmEmailUserRepository {
  constructor(@InjectModel('User') private userModel: ReturnModelType<typeof User>) {}

  async loadById(_id: string): Promise<DocumentType<User>> {
    return this.userModel.findOne({ _id }).exec();
  }

  async loadByEmail(email: string,
    verifiedEmail?: boolean | undefined): Promise<DocumentType<User>> {
    return this.userModel.findOne({ email, verifiedEmail }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<DocumentType<User>> {
    return this.userModel.create(createUserDto);
  }

  confirmEmail(token: string): Promise<DocumentType<User>> {
    return this.userModel.findOneAndUpdate({
      confirmToken: token,
    },
    {
      $set: {
        verifiedEmail: true,
      },
    },
    { new: true }).exec();
  }
}
