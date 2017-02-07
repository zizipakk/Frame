export interface IlogModel { 
    userId: string,
    type: string,
    message: string,
    stack: string,
    location: string
}

export class LogModel implements IlogModel {
    public userId: string;
    public type: string;
    public message: string;
    public stack: string;
    public location: string;

    constructor(model: IlogModel) {
        this.userId = model.userId;
        this.type = model.type;
        this.message = model.message;
        this.stack = model.stack;
        this.location = model.location;
    }
}