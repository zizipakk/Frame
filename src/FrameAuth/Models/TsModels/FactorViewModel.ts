

export interface IfactorViewModel {
    purpose: string;
    
}

export class FactorViewModel {
    public purpose: string;
    
    constructor(model: IfactorViewModel) {
        this.purpose = model.purpose;
        
    }
}
 