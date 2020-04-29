import { User } from '~/modules/users/model/user.model';

export interface LoadUserByIdRepository {
  loadById(_id: string): Promise<User>
}
