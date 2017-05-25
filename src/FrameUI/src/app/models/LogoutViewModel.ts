import * as def from "class-validator";
import * as cust from "../decorators/validators";

import { PortType } from './ComConfigModels';
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
 