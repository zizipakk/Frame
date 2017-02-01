import { UserModel } from './user';
import { Message } from 'primeng/primeng';

export interface IappState {
    UserReducer: UserModel;
    NotificationReducer: Message[];
    MessageReducer: Message[];
    BlockerReducer: boolean;
}