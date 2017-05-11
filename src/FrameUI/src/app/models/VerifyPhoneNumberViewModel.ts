

export interface IverifyPhoneNumberViewModel {
    code: string;
    phoneNumber: string;
    
}

export class VerifyPhoneNumberViewModel implements IverifyPhoneNumberViewModel {
    public code: string;
    public phoneNumber: string;
    
    constructor(model?: IverifyPhoneNumberViewModel) {
        if(model) {
            this.code = model.code;
            this.phoneNumber = model.phoneNumber;
            
        }
    }
}
 