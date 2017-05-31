
import * as def from 'class-validator';
import * as cust from '../decorators/validators';

export interface IaddPhoneNumberViewModel {
    phoneNumber: string;
    
}

export class AddPhoneNumberViewModel implements IaddPhoneNumberViewModel {
	@cust.Required()
    public phoneNumber: string;
    
    constructor(model?: IaddPhoneNumberViewModel) {
        if(model) {
            this.phoneNumber = model.phoneNumber;
            
        }
    }
}
 