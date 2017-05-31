import * as def from 'class-validator';
import * as cust from '../decorators/validators';

export interface IverifyPhoneNumberViewModel {
    code: string;
    phoneNumber: string;
    
}

export class VerifyPhoneNumberViewModel implements IverifyPhoneNumberViewModel {
	@cust.Required()
    public code: string;
    
	@cust.Required()
    public phoneNumber: string;
    
    constructor(model?: IverifyPhoneNumberViewModel) {
        if(model) {
            this.code = model.code;
            this.phoneNumber = model.phoneNumber;
            
        }
    }
}
 