"use strict";
var router_1 = require('@angular/router');
var home_1 = require('./home/home');
var account_1 = require('./account/account');
var login_1 = require('./account/login');
var register_1 = require('./account/register');
var appRoutes = [
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
    },
    { path: '**', redirectTo: '/', pathMatch: 'full' } // at last ...
];
exports.appRouting = router_1.RouterModule.forRoot(appRoutes);
