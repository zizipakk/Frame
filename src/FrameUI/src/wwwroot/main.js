import './polyfills';
import './vendor';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
if (environment.production) {
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule).catch(function (err) { return console.error(err); });
//# sourceMappingURL=C:/FRAME/Frame/src/FrameUI/src/main.js.map