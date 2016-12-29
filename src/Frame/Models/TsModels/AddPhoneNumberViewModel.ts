

    export interface IaddPhoneNumberViewModel {
        phoneNumber: string;
        
    }

    export class AddPhoneNumberViewModel {
        public phoneNumber: string;
        
        constructor(model: IaddPhoneNumberViewModel) {
            this.phoneNumber = model.phoneNumber;
            
        }
    }
 