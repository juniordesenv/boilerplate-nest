import { UserModel } from './user-model.interface';

export interface ConfirmEmailUserRepository {
  confirmEmail(token: string): Promise<UserModel>
}
