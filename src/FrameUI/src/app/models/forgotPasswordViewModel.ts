export interface IforgotPasswordViewModel {
    email: string;
    
}

export class ForgotPasswordViewModel implements IforgotPasswordViewModel {
    public email: string;
    
    constructor(model?: IforgotPasswordViewModel) {
        
        if(model) {
            this.email = model.email;
            
        }
    }
}
 