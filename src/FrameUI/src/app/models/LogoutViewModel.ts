

export interface IlogoutViewModel {
    logoutId: string;
    
}

export class LogoutViewModel implements IlogoutViewModel {
    public logoutId: string;
    
    constructor(model?: IlogoutViewModel) {
        if(model) {
            this.logoutId = model.logoutId;
            
        }
    }
}
 