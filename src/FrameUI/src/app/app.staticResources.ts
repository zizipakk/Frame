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

//// TODO: maybe generic step is get config
// import { AppComponent } from './app.component';
// import { Configuration } from './configuration';
//function getAppModule(conf) {
//    @NgModule({
//        declarations: [AppComponent],
//        imports: [BrowserModule],
//        bootstrap: [AppComponent],
//        providers: [
//            { provide: Configuration, useValue: conf }
//        ]
//    })
//    class AppModule {
//    }
//    return AppModule;
//}

/**
 * Absolutly static class for get observable localized error messages
 */
export class ErrorMessages {

    public static localizedKeys: string | any;

    static translate: TranslateService = getTranslate();


    // At first laod, then get resource
    static async load(): Promise<any> {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        this.localizedKeys = await this.translate.get(["ValdationErrors"]).toPromise();
    }
} 

/**
 * Get resource
 * @param key
 */
export async function getErrorText(key: string): Promise<string> {
    let resource =  "";

    if (!ErrorMessages.localizedKeys) {
        await ErrorMessages.load();
        resource = ErrorMessages.localizedKeys["ValdationErrors"][key];
    }

    return resource;
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
    return injector.get(TranslateService);
}
/** Helpers for instantiate translate service before load app */
