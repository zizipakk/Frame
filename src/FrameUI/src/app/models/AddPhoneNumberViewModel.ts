

export interface IaddPhoneNumberViewModel {
    phoneNumber: string;
    
}

export class AddPhoneNumberViewModel implements IaddPhoneNumberViewModel {
    public phoneNumber: string;
    
    constructor(model?: IaddPhoneNumberViewModel) {
        if(model) {
            this.phoneNumber = model.phoneNumber;
            
        }
    }
}
 