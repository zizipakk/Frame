import { RouterConfig, provideRouter } from '@angular/router';
import { Home } from './components/home';
import { Account } from './components/account/account';
import { Login } from './components/account/login';
import { Register } from './components/account/register';

export const ROUTES: RouterConfig = [
    { path: '', component: Home },
    {
        path: 'account', component: Account,
        children: [
            {
                path: 'login',
                component: Login
            },
            {
                path: 'register',
                component: Register
            }
        ]
    }
];

export const APP_ROUTER_PROVIDERS = [provideRouter(ROUTES)];