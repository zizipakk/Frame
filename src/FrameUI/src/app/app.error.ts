import { Injectable, Injector, ErrorHandler, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { IappState } from './models/appState';
import { IuserModel } from './models/user';
import { IlogModel } from './models/log';
import { API } from './app.settings';
import { DataService } from './services/dataService';
import { NotificationService } from './services/notificationService'; 

/**
 * Global error handling and log sending
 */
@Injectable()
export class AppErrorHandler implements ErrorHandler, OnDestroy {

  readonly apiAction = 'log';
  apiLog = API.LOG + this.apiAction;
  rethrowError: boolean;
  user: IuserModel;
  subscription: Subscription;

  constructor(
    private store: Store<IappState>,
    // TODO: We cant direct inject DataService, because cycling ref (mybe http | routing). So just do it through injector
    private injector: Injector,
    private notificationService: NotificationService
    ) {
      this.rethrowError = false; // setup behavior
      this.subscription = 
        this.store.select(s => s.UserReducer)
          .subscribe((user) => { 
            this.user = user; 
          });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

  // I send the error the browser console (safely, if it exists).
  public sendToConsole(error: any, blockText?: string) {
    if ( console && console.group && console.error ) {
        console.group( blockText ? blockText : "Error Log Service" );
        console.error( error );
        console.error( error.message );
        console.error( error.stack );
        console.groupEnd();
    }
  }
  
  // This property only for indirect DataService usage 
  get dataService(): DataService {
    return this.injector.get(DataService);
  }
 

  public handleError(error: any) : void {
    try {
        let unwrappedError = this.findOriginalError(error);
        this.notificationService.printErrorMessage(new Array<string>('Application throw inner error. We try to handle...'));

        // At first to console
        this.sendToConsole(unwrappedError, 'ErrorHandler');

        // TODO viewmodel
        let data: IlogModel =
          { 
              userId: this.user.userId,
              type: unwrappedError.name,
              message: unwrappedError.message,
              stack: unwrappedError.stack,
              location: unwrappedError.location ? unwrappedError.location.href : ''
          };
        this.dataService.post<string>(
            this.apiLog,
            data
          )
          .subscribe(result => {
              this.notificationService.printInfoNotification(new Array<string>('We succesfull sent the error to us. Your ticked id: ' + result));
          },
          error => {
              this.sendToConsole(error, 'Network Error');
              this.notificationService.printErrorNotification(new Array<string>('We could not send the error. Pls check the browser console!'));
          },
          () => {});

    } catch ( loggingError ) {
        console.group( "ErrorHandler" );
        console.warn( "Error when trying to log error." );
        console.error( loggingError );
        console.groupEnd();
    }

    // if neccessary drop to the next handler
    if (this.rethrowError) {
        throw(error);
    }

  }

  // I attempt to find the underlying error in the given Wrapped error.
  private findOriginalError(error: any) {
      while (error && error.originalError) {
          error = error.originalError;
      }

      return(error);

  }

  //// I log the given error to various aggregation and tracking services.
    // public logError( error: any ) : void {
    //     // Software-as-a-Service (SaaS) tracking.
    //     this.sendToNewRelic( error );
    //     this.sendToRaygun( error );
    //     this.sendToRollbar( error );
    //     this.sendToTrackJs( error );
    // }

    // // Read more: https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-apis/report-data-events-browser-agent-api
    // private sendToNewRelic( error: any ) : void {
    //     newrelic.noticeError( error );
    // }
    // // Read more: https://raygun.com/raygun-providers/javascript
    // private sendToRaygun( error: any ) : void {
    //     Raygun.send( error );
    // }
    // // Read more: https://rollbar.com/docs/notifier/rollbar.js/api/
    // private sendToRollbar( error: any ) : void {
    //     Rollbar.error( error );
    // }
    // // Read more: http://docs.trackjs.com/tracker/framework-integrations#angular
    // private sendToTrackJs( error: any ) : void {
    //     trackJs.track( error );
    // }

}
