import { CreateUserDto } from '~/modules/users/dto';
import { User } from '~/modules/users/model/user.model';

export interface CreateUserRepository {
  create(createUserDTO: CreateUserDto): Promise<User>
}
