import { UserModel } from './user-model.interface';
import { CreateUserDto } from '~/dto/users/create-user.dto';

export interface CreateUserRepository {
  create(createUserDTO: CreateUserDto): Promise<UserModel>
}
