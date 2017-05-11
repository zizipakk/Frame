export interface IlogDTO {
    id: string;
    timeStamp: Date;
    userId: string;
    type: string;
    message: string;
    stack: string;
    location: string;
    
}

export class LogDTO implements IlogDTO {
    public id: string;
    public timeStamp: Date;
    public userId: string;
    public type: string;
    public message: string;
    public stack: string;
    public location: string;
    
    constructor(model?: IlogDTO) {
        
        if(model) {
            this.id = model.id;
            this.timeStamp = model.timeStamp;
            this.userId = model.userId;
            this.type = model.type;
            this.message = model.message;
            this.stack = model.stack;
            this.location = model.location;
            
        }
    }
}
export interface IlogView extends IlogDTO {
    
}

export class LogView extends LogDTO implements IlogView {
    
    constructor(model?: IlogView) {
        super(model);
        if(model) {
            
        }
    }
}
 