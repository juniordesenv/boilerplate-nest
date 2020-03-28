import { UserModel } from './user-model.interface';

export interface LoadUserByEmailRepository {
  loadByEmail(email: string): Promise<UserModel>
}
