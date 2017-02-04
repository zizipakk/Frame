import { ErrorHandler } from '@angular/core';

export class AppErrorHandler implements ErrorHandler {
  handleError(error) {
      console.log('global error');


      // if not net error, we send error to api
  }
}