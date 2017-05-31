
import { PortType } from './ComConfigModels';

export interface IcomPortTypeDTO {
    id: string;
    timeStamp: Date;
    portType: PortType;
    addressFormat: string;
    readProtocol: string;
    writeProtocol: string;
    
}

export class ComPortTypeDTO implements IcomPortTypeDTO {
    public id: string;
    
    public timeStamp: Date;
    
    public portType: PortType;
    
    public addressFormat: string;
    
    public readProtocol: string;
    
    public writeProtocol: string;
    
    constructor(model?: IcomPortTypeDTO) {
        if(model) {
            this.id = model.id;
            this.timeStamp = model.timeStamp;
            this.portType = model.portType;
            this.addressFormat = model.addressFormat;
            this.readProtocol = model.readProtocol;
            this.writeProtocol = model.writeProtocol;
            
        }
    }
}

export interface IcomPortTypeView extends IcomPortTypeDTO {
    
}

export class ComPortTypeView extends ComPortTypeDTO implements IcomPortTypeView {
    constructor(model?: IcomPortTypeView) {
	super(model);

        if(model) {
            
        }
    }
}
 