

export interface IcomLogDTO {
    id: string;
    timeStamp: Date;
    userId: string;
    port: string;
    action: string;
    location: string;
    
}

export class ComLogDTO implements IcomLogDTO {
    public id: string;
    
    public timeStamp: Date;
    
    public userId: string;
    
    public port: string;
    
    public action: string;
    
    public location: string;
    
    constructor(model?: IcomLogDTO) {
        if(model) {
            this.id = model.id;
            this.timeStamp = model.timeStamp;
            this.userId = model.userId;
            this.port = model.port;
            this.action = model.action;
            this.location = model.location;
            
        }
    }
}

export interface IcomLogView extends IcomLogDTO {
    
}

export class ComLogView extends ComLogDTO implements IcomLogView {
    constructor(model?: IcomLogView) {
	super(model);

        if(model) {
            
        }
    }
}
 