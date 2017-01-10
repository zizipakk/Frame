import { ISelectListItem } from './SelectListItem';

export interface IconfigureTwoFactorViewModel {
    selectedProvider: string;
    providers: ISelectListItem[];
    
}

export class ConfigureTwoFactorViewModel {
    public selectedProvider: string;
    public providers: ISelectListItem[];
    
    constructor(model: IconfigureTwoFactorViewModel) {
        this.selectedProvider = model.selectedProvider;
        this.providers = model.providers;
        
    }
}
 