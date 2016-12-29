

    export interface IsendCodeViewModel {
        selectedProvider: string;
        providers: SelectListItem[];
        returnUrl: string;
        rememberMe: boolean;
        
    }

    export class SendCodeViewModel {
        public selectedProvider: string;
        public providers: SelectListItem[];
        public returnUrl: string;
        public rememberMe: boolean;
        
        constructor(model: IsendCodeViewModel) {
            this.selectedProvider = model.selectedProvider;
            this.providers = model.providers;
            this.returnUrl = model.returnUrl;
            this.rememberMe = model.rememberMe;
            
        }
    }
 