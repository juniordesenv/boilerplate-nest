import { User } from '~/modules/users/model/user.model';

export interface LoadUserByEmailRepository {
  loadByEmail(email: string): Promise<User>
}
