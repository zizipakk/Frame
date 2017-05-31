
export interface IcomDeviceConfigDTO {
    id: string;
    timeStamp: Date;
    deviceName: string;
    
}

export class ComDeviceConfigDTO implements IcomDeviceConfigDTO {
    public id: string;
    
    public timeStamp: Date;
    
    public deviceName: string;
    
    constructor(model?: IcomDeviceConfigDTO) {
        if(model) {
            this.id = model.id;
            this.timeStamp = model.timeStamp;
            this.deviceName = model.deviceName;
            
        }
    }
}

export interface IcomDeviceConfigView extends IcomDeviceConfigDTO {
    
}

export class ComDeviceConfigView extends ComDeviceConfigDTO implements IcomDeviceConfigView {
    constructor(model?: IcomDeviceConfigView) {
	super(model);

        if(model) {
            
        }
    }
}
 