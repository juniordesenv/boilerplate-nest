import { UserModel } from './user-model.interface';

export interface LoadUserByIdRepository {
  loadById(_id: string): Promise<UserModel>
}
