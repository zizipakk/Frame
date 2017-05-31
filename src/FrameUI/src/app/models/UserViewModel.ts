
export enum LanguageIso {
    en = 0,
    hu = 1,
    de = 2    
}

export interface IuserViewModel {
    accessFailedCount: number;
    email: string;
    emailConfirmed: boolean;
    id: string;
    lockoutEnabled: boolean;
    lockoutEnd: Date;
    normalizedEmail: string;
    normalizedUserName: string;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    userName: string;
    isAdmin: boolean;
    language: LanguageIso;
    
}

export class UserViewModel implements IuserViewModel {
    public accessFailedCount: number;
    
    public email: string;
    
    public emailConfirmed: boolean;
    
    public id: string;
    
    public lockoutEnabled: boolean;
    
    public lockoutEnd: Date;
    
    public normalizedEmail: string;
    
    public normalizedUserName: string;
    
    public phoneNumber: string;
    
    public phoneNumberConfirmed: boolean;
    
    public twoFactorEnabled: boolean;
    
    public userName: string;
    
    public isAdmin: boolean;
    
    public language: LanguageIso;
    
    constructor(model?: IuserViewModel) {
        if(model) {
            this.accessFailedCount = model.accessFailedCount;
            this.email = model.email;
            this.emailConfirmed = model.emailConfirmed;
            this.id = model.id;
            this.lockoutEnabled = model.lockoutEnabled;
            this.lockoutEnd = model.lockoutEnd;
            this.normalizedEmail = model.normalizedEmail;
            this.normalizedUserName = model.normalizedUserName;
            this.phoneNumber = model.phoneNumber;
            this.phoneNumberConfirmed = model.phoneNumberConfirmed;
            this.twoFactorEnabled = model.twoFactorEnabled;
            this.userName = model.userName;
            this.isAdmin = model.isAdmin;
            this.language = model.language;
            
        }
    }
}
 