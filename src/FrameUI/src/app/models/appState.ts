import { UserModel } from './userModel';
import { Message } from 'primeng/primeng';

export interface IappState {
    UserReducer: UserModel;
    NotificationReducer: Message[];
    MessageReducer: Message[];
    BlockerReducer: boolean;
}