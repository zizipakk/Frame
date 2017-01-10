

export interface IlogoutViewModel {
    logoutId: string;
    
}

export class LogoutViewModel {
    public logoutId: string;
    
    constructor(model: IlogoutViewModel) {
        this.logoutId = model.logoutId;
        
    }
}
 