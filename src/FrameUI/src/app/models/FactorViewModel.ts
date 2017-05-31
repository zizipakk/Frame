

export interface IfactorViewModel {
    purpose: string;
    
}

export class FactorViewModel implements IfactorViewModel {
    public purpose: string;
    
    constructor(model?: IfactorViewModel) {
        if(model) {
            this.purpose = model.purpose;
            
        }
    }
}
 