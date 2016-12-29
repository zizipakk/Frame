

    export interface IconfigureTwoFactorViewModel {
        selectedProvider: string;
        providers: SelectListItem[];
        
    }

    export class ConfigureTwoFactorViewModel {
        public selectedProvider: string;
        public providers: SelectListItem[];
        
        constructor(model: IconfigureTwoFactorViewModel) {
            this.selectedProvider = model.selectedProvider;
            this.providers = model.providers;
            
        }
    }
 