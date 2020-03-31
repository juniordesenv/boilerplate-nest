import { UserModel } from './user-model.interface';
import { CreateUserDto } from '~/modules/users/dto';

export interface CreateUserRepository {
  create(createUserDTO: CreateUserDto): Promise<UserModel>
}
