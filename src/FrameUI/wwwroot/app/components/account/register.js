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
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var router_1 = require('@angular/router');
var registration_1 = require('../../models/registration');
var routes_1 = require('../../routes');
var operationResult_1 = require('../../models/operationResult');
var membershipService_1 = require('../../services/membershipService');
var notificationService_1 = require('../../services/notificationService');
var Register = (function () {
    function Register(membershipService, notificationService, 
        //private route: ActivatedRoute,
        router) {
        this.membershipService = membershipService;
        this.notificationService = notificationService;
        this.router = router;
        this.newUser = new registration_1.Registration('', '', '');
    }
    Register.prototype.ngOnInit = function () {
    };
    Register.prototype.register = function () {
        var _this = this;
        var registrationResult = new operationResult_1.OperationResult(false, '');
        this.membershipService.register(this.newUser)
            .subscribe(function (res) {
            registrationResult.Succeeded = res.Succeeded;
            registrationResult.Message = res.Message;
        }, function (error) { return console.error('Error: ' + error); }, function () {
            if (registrationResult.Succeeded) {
                _this.notificationService.printSuccessMessage('Dear ' + _this.newUser.Username + ', please login with your credentials');
                //?
                _this.router.navigate([routes_1.ROUTES.map(function (m) { return m.path == 'login'; })]);
            }
            else {
                _this.notificationService.printErrorMessage(registrationResult.Message);
            }
        });
    };
    ;
    Register = __decorate([
        core_1.Component({
            selector: 'register',
            templateUrl: './app/components/account/register.html',
            directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES],
            providers: [membershipService_1.MembershipService, notificationService_1.NotificationService]
        }), 
        __metadata('design:paramtypes', [membershipService_1.MembershipService, notificationService_1.NotificationService, router_1.Router])
    ], Register);
    return Register;
}());
exports.Register = Register;
//# sourceMappingURL=register.js.map