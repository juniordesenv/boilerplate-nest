import { DocumentType } from '@typegoose/typegoose';
import { User } from '~/modules/users/model/user.model';

export interface ConfirmEmailUserRepository {
  confirmEmail(token: string): Promise<DocumentType<User>>
}
