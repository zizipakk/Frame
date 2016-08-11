"use strict";
var router_1 = require('@angular/router');
var home_1 = require('./components/home');
var account_1 = require('./components/account/account');
var login_1 = require('./components/account/login');
var register_1 = require('./components/account/register');
exports.ROUTES = [
    { path: '', component: home_1.Home },
    {
        path: 'account', component: account_1.Account,
        children: [
            {
                path: 'login',
                component: login_1.Login
            },
            {
                path: 'register',
                component: register_1.Register
            }
        ]
    }
];
exports.APP_ROUTER_PROVIDERS = [router_1.provideRouter(exports.ROUTES)];
