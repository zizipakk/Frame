

export interface IconsentViewModel {
    clientName: string;
    clientUrl: string;
    clientLogoUrl: string;
    allowRememberConsent: boolean;
    identityScopes: ScopeViewModel[];
    resourceScopes: ScopeViewModel[];
    
}

export class ConsentViewModel {
    public clientName: string;
    public clientUrl: string;
    public clientLogoUrl: string;
    public allowRememberConsent: boolean;
    public identityScopes: ScopeViewModel[];
    public resourceScopes: ScopeViewModel[];
    
    constructor(model: IconsentViewModel) {
        this.clientName = model.clientName;
        this.clientUrl = model.clientUrl;
        this.clientLogoUrl = model.clientLogoUrl;
        this.allowRememberConsent = model.allowRememberConsent;
        this.identityScopes = model.identityScopes;
        this.resourceScopes = model.resourceScopes;
        
    }
}

export interface IscopeViewModel {
    name: string;
    displayName: string;
    description: string;
    emphasize: boolean;
    required: boolean;
    checked: boolean;
    
}

export class ScopeViewModel {
    public name: string;
    public displayName: string;
    public description: string;
    public emphasize: boolean;
    public required: boolean;
    public checked: boolean;
    
    constructor(model: IscopeViewModel) {
        this.name = model.name;
        this.displayName = model.displayName;
        this.description = model.description;
        this.emphasize = model.emphasize;
        this.required = model.required;
        this.checked = model.checked;
        
    }
}
 