"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var testing_1 = require('@angular/core/testing');
var testing_2 = require('@angular/compiler/testing');
var tabs_1 = require('./tabs');
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var Observable_1 = require('rxjs/Observable');
testing_1.describe('MdTabGroup', function () {
    var builder;
    var fixture;
    testing_1.beforeEach(testing_1.inject([testing_2.TestComponentBuilder], function (tcb) {
        builder = tcb;
    }));
    testing_1.describe('basic behavior', function () {
        testing_1.beforeEach(testing_1.async(function () {
            builder.createAsync(SimpleTabsTestApp).then(function (f) {
                fixture = f;
            });
        }));
        testing_1.it('should default to the first tab', function () {
            checkSelectedIndex(1);
        });
        testing_1.it('should change selected index on click', function () {
            var component = fixture.debugElement.componentInstance;
            component.selectedIndex = 0;
            checkSelectedIndex(0);
            // select the second tab
            var tabLabel = fixture.debugElement.queryAll(platform_browser_1.By.css('.md-tab-label'))[1];
            tabLabel.nativeElement.click();
            checkSelectedIndex(1);
            // select the third tab
            tabLabel = fixture.debugElement.queryAll(platform_browser_1.By.css('.md-tab-label'))[2];
            tabLabel.nativeElement.click();
            checkSelectedIndex(2);
        });
        testing_1.it('should support two-way binding for selectedIndex', testing_1.async(function () {
            var component = fixture.componentInstance;
            component.selectedIndex = 0;
            fixture.detectChanges();
            var tabLabel = fixture.debugElement.queryAll(platform_browser_1.By.css('.md-tab-label'))[1];
            tabLabel.nativeElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(function () {
                testing_1.expect(component.selectedIndex).toBe(1);
            });
        }));
        testing_1.it('should cycle through tab focus with focusNextTab/focusPreviousTab functions', testing_1.fakeAsync(function () {
            var testComponent = fixture.componentInstance;
            var tabComponent = fixture.debugElement.query(platform_browser_1.By.css('md-tab-group')).componentInstance;
            spyOn(testComponent, 'handleFocus').and.callThrough();
            fixture.detectChanges();
            tabComponent.focusIndex = 0;
            fixture.detectChanges();
            testing_1.tick();
            testing_1.expect(tabComponent.focusIndex).toBe(0);
            testing_1.expect(testComponent.handleFocus).toHaveBeenCalledTimes(1);
            testing_1.expect(testComponent.focusEvent.index).toBe(0);
            tabComponent.focusNextTab();
            fixture.detectChanges();
            testing_1.tick();
            testing_1.expect(tabComponent.focusIndex).toBe(1);
            testing_1.expect(testComponent.handleFocus).toHaveBeenCalledTimes(2);
            testing_1.expect(testComponent.focusEvent.index).toBe(1);
            tabComponent.focusNextTab();
            fixture.detectChanges();
            testing_1.tick();
            testing_1.expect(tabComponent.focusIndex).toBe(2);
            testing_1.expect(testComponent.handleFocus).toHaveBeenCalledTimes(3);
            testing_1.expect(testComponent.focusEvent.index).toBe(2);
            tabComponent.focusNextTab();
            fixture.detectChanges();
            testing_1.tick();
            testing_1.expect(tabComponent.focusIndex).toBe(2); // should stop at 2
            testing_1.expect(testComponent.handleFocus).toHaveBeenCalledTimes(3);
            testing_1.expect(testComponent.focusEvent.index).toBe(2);
            tabComponent.focusPreviousTab();
            fixture.detectChanges();
            testing_1.tick();
            testing_1.expect(tabComponent.focusIndex).toBe(1);
            testing_1.expect(testComponent.handleFocus).toHaveBeenCalledTimes(4);
            testing_1.expect(testComponent.focusEvent.index).toBe(1);
            tabComponent.focusPreviousTab();
            fixture.detectChanges();
            testing_1.tick();
            testing_1.expect(tabComponent.focusIndex).toBe(0);
            testing_1.expect(testComponent.handleFocus).toHaveBeenCalledTimes(5);
            testing_1.expect(testComponent.focusEvent.index).toBe(0);
            tabComponent.focusPreviousTab();
            fixture.detectChanges();
            testing_1.tick();
            testing_1.expect(tabComponent.focusIndex).toBe(0); // should stop at 0
            testing_1.expect(testComponent.handleFocus).toHaveBeenCalledTimes(5);
            testing_1.expect(testComponent.focusEvent.index).toBe(0);
        }));
        testing_1.it('should change tabs based on selectedIndex', testing_1.fakeAsync(function () {
            var component = fixture.componentInstance;
            var tabComponent = fixture.debugElement.query(platform_browser_1.By.css('md-tab-group')).componentInstance;
            spyOn(component, 'handleSelection').and.callThrough();
            checkSelectedIndex(1);
            tabComponent.selectedIndex = 2;
            checkSelectedIndex(2);
            testing_1.tick();
            testing_1.expect(component.handleSelection).toHaveBeenCalledTimes(1);
            testing_1.expect(component.selectEvent.index).toBe(2);
        }));
    });
    testing_1.describe('async tabs', function () {
        testing_1.beforeEach(testing_1.async(function () {
            builder.createAsync(AsyncTabsTestApp).then(function (f) { return fixture = f; });
        }));
        testing_1.it('should show tabs when they are available', testing_1.async(function () {
            var labels = fixture.debugElement.queryAll(platform_browser_1.By.css('.md-tab-label'));
            testing_1.expect(labels.length).toBe(0);
            fixture.detectChanges();
            fixture.whenStable().then(function () {
                fixture.detectChanges();
                labels = fixture.debugElement.queryAll(platform_browser_1.By.css('.md-tab-label'));
                testing_1.expect(labels.length).toBe(2);
            });
        }));
    });
    /**
     * Checks that the `selectedIndex` has been updated; checks that the label and body have the
     * `md-active` class
     */
    function checkSelectedIndex(index) {
        fixture.detectChanges();
        var tabComponent = fixture.debugElement
            .query(platform_browser_1.By.css('md-tab-group')).componentInstance;
        testing_1.expect(tabComponent.selectedIndex).toBe(index);
        var tabLabelElement = fixture.debugElement
            .query(platform_browser_1.By.css(".md-tab-label:nth-of-type(" + (index + 1) + ")")).nativeElement;
        testing_1.expect(tabLabelElement.classList.contains('md-active')).toBe(true);
        var tabContentElement = fixture.debugElement
            .query(platform_browser_1.By.css("#" + tabLabelElement.id)).nativeElement;
        testing_1.expect(tabContentElement.classList.contains('md-active')).toBe(true);
    }
});
var SimpleTabsTestApp = (function () {
    function SimpleTabsTestApp() {
        this.selectedIndex = 1;
    }
    SimpleTabsTestApp.prototype.handleFocus = function (event) {
        this.focusEvent = event;
    };
    SimpleTabsTestApp.prototype.handleSelection = function (event) {
        this.selectEvent = event;
    };
    SimpleTabsTestApp = __decorate([
        core_1.Component({
            selector: 'test-app',
            template: "\n    <md-tab-group class=\"tab-group\"\n        [(selectedIndex)]=\"selectedIndex\"\n        (focusChange)=\"handleFocus($event)\"\n        (selectChange)=\"handleSelection($event)\">\n      <md-tab>\n        <template md-tab-label>Tab One</template>\n        <template md-tab-content>Tab one content</template>\n      </md-tab>\n      <md-tab>\n        <template md-tab-label>Tab Two</template>\n        <template md-tab-content>Tab two content</template>\n      </md-tab>\n      <md-tab>\n        <template md-tab-label>Tab Three</template>\n        <template md-tab-content>Tab three content</template>\n      </md-tab>\n    </md-tab-group>\n  ",
            directives: [tabs_1.MD_TABS_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], SimpleTabsTestApp);
    return SimpleTabsTestApp;
}());
var AsyncTabsTestApp = (function () {
    function AsyncTabsTestApp() {
        var _this = this;
        this._tabs = [
            { label: 'one', content: 'one' },
            { label: 'two', content: 'two' }
        ];
        this.tabs = Observable_1.Observable.create(function (observer) {
            requestAnimationFrame(function () { return observer.next(_this._tabs); });
        });
    }
    AsyncTabsTestApp = __decorate([
        core_1.Component({
            selector: 'test-app',
            template: "\n    <md-tab-group class=\"tab-group\">\n      <md-tab *ngFor=\"let tab of tabs | async\">\n        <template md-tab-label>{{ tab.label }}</template>\n        <template md-tab-content>{{ tab.content }}</template>\n      </md-tab>\n   </md-tab-group>\n  ",
            directives: [tabs_1.MD_TABS_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], AsyncTabsTestApp);
    return AsyncTabsTestApp;
}());
//# sourceMappingURL=tab-group.spec.js.map