

    export interface IloggedOutViewModel {
        postLogoutRedirectUri: string;
        clientName: string;
        signOutIframeUrl: string;
        
    }

    export class LoggedOutViewModel {
        public postLogoutRedirectUri: string;
        public clientName: string;
        public signOutIframeUrl: string;
        
        constructor(model: IloggedOutViewModel) {
            this.postLogoutRedirectUri = model.postLogoutRedirectUri;
            this.clientName = model.clientName;
            this.signOutIframeUrl = model.signOutIframeUrl;
            
        }
    }
 