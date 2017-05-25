import { TranslateService, TranslateLoader, MissingTranslationHandler, TranslateParser } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateStore } from "@ngx-translate/core/src/translate.store";
import { TranslateFakeLoader } from "@ngx-translate/core/src/translate.loader";
import { FakeMissingTranslationHandler } from "@ngx-translate/core/src/missing-translation-handler";
import { TranslateDefaultParser } from "@ngx-translate/core/src/translate.parser";
import { ReflectiveInjector } from '@angular/core';
import {
    Http, Headers, BrowserXhr,
    RequestOptions, BaseRequestOptions,
    ResponseOptions, BaseResponseOptions,
    ConnectionBackend, XHRBackend,
    XSRFStrategy, CookieXSRFStrategy
} from "@angular/http";

/**
 * Absolutly static class for get observable localized error messages
 */
export class ErrorMessages {
    static injector = ReflectiveInjector.resolveAndCreate([
        Http,
        BrowserXhr,
        { provide: RequestOptions, useClass: BaseRequestOptions },
        { provide: ResponseOptions, useClass: BaseResponseOptions },
        { provide: ConnectionBackend, useClass: XHRBackend },
        { provide: XSRFStrategy, useFactory: () => new CookieXSRFStrategy() },
    ]);
    static http = ErrorMessages.injector.get(Http);

    public static localizedKeys: any;
    static translate: TranslateService =
      new TranslateService(
        new TranslateStore(),
        new TranslateHttpLoader(ErrorMessages.http) as TranslateLoader,
        new TranslateDefaultParser() as TranslateParser,
        new FakeMissingTranslationHandler() as MissingTranslationHandler
      );

    static async load() {
        return await new Promise((resolve) => {
            this.translate.get(["ValdationErrors"])
                .subscribe(res => {
                    ErrorMessages.localizedKeys = res;
                    resolve();
                });
        });
    }
} 

export function getErrorText(key: string): string {
    if (!ErrorMessages.localizedKeys) {
        ErrorMessages.load();
        return ErrorMessages.localizedKeys["ValdationErrors"][key];
    }

    return key;
}

