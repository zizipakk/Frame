

    export interface IforgotPasswordViewModel {
        email: string;
        
    }

    export class ForgotPasswordViewModel {
        public email: string;
        
        constructor(model: IforgotPasswordViewModel) {
            this.email = model.email;
            
        }
    }
 