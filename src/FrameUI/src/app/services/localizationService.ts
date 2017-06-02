import { TranslateService, TranslateLoader, MissingTranslationHandler, TranslateParser } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateStore } from "@ngx-translate/core/src/translate.store";
import { TranslateFakeLoader } from "@ngx-translate/core/src/translate.loader";
import { FakeMissingTranslationHandler } from "@ngx-translate/core/src/missing-translation-handler";
import { TranslateDefaultParser } from "@ngx-translate/core/src/translate.parser";
import { ReflectiveInjector, Injectable, OpaqueToken, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import {
    Http, CookieXSRFStrategy, XSRFStrategy, RequestOptions, BaseRequestOptions,
    ResponseOptions, BaseResponseOptions, XHRBackend, BrowserXhr, Response
} from '@angular/http';

class NoopCookieXSRFStrategy extends CookieXSRFStrategy {
    configureRequest(request) {
        // noop
    }
}

/**
 * Absolutly static methods for get observable localized error messages
 * Injecable also for dynamic usage of tranlatetion
 */
@Injectable()
export class LocalizationService {

    // Static usage: preloading is spacial, because no reactive usage in validator messages
    private static translateService: TranslateService = getTranslate();       

    public static localizedValdationErrors: any;
    private static async loadValdationErrors() {
        await this.translateService.get(["ValdationErrors"])
            .catch(error => {
                return Observable.throw(error);
            })
            .toPromise()
            .then(res => { 
                    this.localizedValdationErrors = res;
                });
    }
    public static getValdationErrorMessage(key: string): string {
        if (!this.localizedValdationErrors)
            this.loadValdationErrors();
        return this.localizedValdationErrors["ValdationErrors"][key];
    }
    //

    // Dynamic usage
    public translator: TranslateService;

    constructor() {
        this.translator = LocalizationService.translateService;
    }

    public changeLanguage(lang: string) {
        LocalizationService.translateService.use(lang);
        LocalizationService.loadValdationErrors();
        this.translator.use(lang);
    }
    //
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
    
    setDefaultLanguage(translateService);

    return translateService;
}

function setDefaultLanguage(translateService: TranslateService) {
    if (!translateService.getDefaultLang()) {
        let lang = "en";//this.translateService.getBrowserLang();
        translateService.setDefaultLang(lang);
        translateService.use(lang);
    }
}
/** Helpers for instantiate translate service before load app */
