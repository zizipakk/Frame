

export interface IverifyPhoneNumberViewModel {
    code: string;
    phoneNumber: string;
    
}

export class VerifyPhoneNumberViewModel {
    public code: string;
    public phoneNumber: string;
    
    constructor(model: IverifyPhoneNumberViewModel) {
        this.code = model.code;
        this.phoneNumber = model.phoneNumber;
        
    }
}
 