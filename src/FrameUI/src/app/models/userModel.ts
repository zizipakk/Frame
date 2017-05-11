import { IuserViewModel, UserViewModel } from './UserViewModel';

export interface IuserModel extends IuserViewModel {
    isAuthorized: boolean;
    hasAdminRole: boolean;
}

export class UserModel extends UserViewModel implements IuserModel {
    public isAuthorized: boolean;
    public hasAdminRole: boolean;
    
    constructor(model?: IuserModel) {
        super(model);
        if(model) {
            this.isAuthorized = model.isAuthorized; 
            this.hasAdminRole = model.hasAdminRole; 
        }
    }
}
 