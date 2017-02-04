import { ErrorHandler } from '@angular/core';
import { Injectable } from "@angular/core";
import { API } from './app.settings';
import { DataService } from './services/dataservice';
import { NotificationService } from './services/notificationservice'; 

// declare var newrelic: { noticeError( error: any ) : void; };
// declare var Raygun: { send( error: any ) : void; }
// declare var Rollbar: { error( error: any ) : void; }
// declare var trackJs: { track( error: any ) : void; }

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  
  readonly apiAction = 'log';
  apiLog = API.LOG + this.apiAction;

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService) {
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
  
  public handleError(error: any) : void {
    try {
        let unwrappedError = this.findOriginalError(error);
        this.notificationService.printErrorMessage(new Array<string>('Application throw inner error. We try to handle...'));

        // At first to console
        this.sendToConsole(unwrappedError, 'ErrorHandler');
        
        // Than try to server            
        this.dataService.post<string>(
          this.apiLog, 
          {
              type: unwrappedError.name,
              message: unwrappedError.message,
              stack: unwrappedError.stack,
              location: unwrappedError.location.href
          })
          .subscribe(result => {
              this.notificationService.printInfoNotification(new Array<string>('We succesfull sent the error to us. Your ticked id: ' + result));
          },
          error => {
              this.notificationService.printErrorNotification(new Array<string>('We could not send the error. Pls check the browser console!'));
          },
          () => {});

    } catch ( loggingError ) {
        console.group( "ErrorHandler" );
        console.warn( "Error when trying to log error." );
        console.error( loggingError );
        console.groupEnd();
    }

    // if ( base.rethrowError ) {
    //     throw( error );
    // }

  }

  // I attempt to find the underlying error in the given Wrapped error.
  private findOriginalError(error: any) {
      while ( error && error.originalError ) {
          error = error.originalError;
      }

      return( error );

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
