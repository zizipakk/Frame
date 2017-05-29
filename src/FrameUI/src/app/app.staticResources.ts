import { TranslateService, TranslateLoader, MissingTranslationHandler, TranslateParser } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateStore } from "@ngx-translate/core/src/translate.store";
import { TranslateFakeLoader } from "@ngx-translate/core/src/translate.loader";
import { FakeMissingTranslationHandler } from "@ngx-translate/core/src/missing-translation-handler";
import { TranslateDefaultParser } from "@ngx-translate/core/src/translate.parser";
import { ReflectiveInjector, Injectable, OpaqueToken, Injector } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import {
    Http, CookieXSRFStrategy, XSRFStrategy, RequestOptions, BaseRequestOptions,
    ResponseOptions, BaseResponseOptions, XHRBackend, BrowserXhr, Response
} from '@angular/http';
import { ValidationOptions } from 'class-validator';

class NoopCookieXSRFStrategy extends CookieXSRFStrategy {
    configureRequest(request) {
        // noop
    }
}

/**
 * Absolutly static class for get observable localized error messages
 */
export class ErrorMessages {

    public static localizedKeys: any;
    static semafor: boolean = false;

    static translateService: TranslateService = getTranslate();       

    static load() {
        ErrorMessages.translateService.get(["ValdationErrors"])
            .catch(error => {
                ErrorMessages.semafor = true;
                return Observable.throw(error);
            })
            .finally(() => {
                ErrorMessages.semafor = false;
            })
            .subscribe(res => ErrorMessages.localizedKeys = res);
        while (!ErrorMessages.localizedKeys && !ErrorMessages.semafor ) {};
    }

    public static getMessage(key: string): string {
        if (!ErrorMessages.localizedKeys)
            ErrorMessages.load();
        return ErrorMessages.localizedKeys["ValdationErrors"][key];
    }
} 

/** Helpers for instantiate translate service before load app */
function getHttp(): Http {
    let providers = [
        {
            provide: Http, useFactory: (backend: XHRBackend, options: RequestOptions) => {
                return new Http(backend, options);
            },
            deps: [XHRBackend, RequestOptions]
        },
        BrowserXhr,
        { provide: RequestOptions, useClass: BaseRequestOptions },
        { provide: ResponseOptions, useClass: BaseResponseOptions },
        XHRBackend,
        { provide: XSRFStrategy, useValue: new NoopCookieXSRFStrategy() }
    ];
    let injector = ReflectiveInjector.resolveAndCreate(providers);
    return injector.get(Http);
}

function translateLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

function translateServiceFactory(store: TranslateStore, currentLoader: TranslateLoader, parser: TranslateParser, missingTranslationHandler: MissingTranslationHandler) {
    return new TranslateService(store, currentLoader, parser, missingTranslationHandler);
}

function getTranslate(): TranslateService {
    let providers = [
        { provide: TranslateService, useFactory: translateServiceFactory, deps: [TranslateStore, TranslateLoader, TranslateParser, MissingTranslationHandler] },
        { provide: Http, useFactory: getHttp },
        TranslateStore,
        { provide: TranslateLoader, useFactory: translateLoaderFactory, deps: [Http] },
        { provide: TranslateParser, useClass: TranslateDefaultParser },
        { provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler }
    ];
    let injector = ReflectiveInjector.resolveAndCreate(providers);

    let translateService = injector.get(TranslateService);

    if (!translateService.getDefaultLang()) {
      let lang = "en";//this.translateService.getBrowserLang();
      translateService.setDefaultLang(lang);
      translateService.use(lang);
    }
    
    return translateService;
}
/** Helpers for instantiate translate service before load app */
