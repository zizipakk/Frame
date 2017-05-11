

export interface IcomPortConfigDTO {
    id: string;
    timeStamp: Date;
    number: number;
    portName: string;
    comPortTypeId: string;
    comDeviceConfigId: string;
    
}

export class ComPortConfigDTO implements IcomPortConfigDTO {
    public id: string;
    public timeStamp: Date;
    public number: number;
    public portName: string;
    public comPortTypeId: string;
    public comDeviceConfigId: string;
    
    constructor(model?: IcomPortConfigDTO) {
        
        if(model) {
            this.id = model.id;
            this.timeStamp = model.timeStamp;
            this.number = model.number;
            this.portName = model.portName;
            this.comPortTypeId = model.comPortTypeId;
            this.comDeviceConfigId = model.comDeviceConfigId;
            
        }
    }
}

export interface IcomPortConfigView extends IcomPortConfigDTO {
    
}

export class ComPortConfigView extends ComPortConfigDTO implements IcomPortConfigView {
    
    constructor(model?: IcomPortConfigView) {
        super(model);
        if(model) {
            
        }
    }
}
 