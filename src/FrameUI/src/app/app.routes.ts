import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Home } from './home/home';
import { Account } from './account/account';
import { Login } from './account/login';
import { Register } from './account/register';

export const appRoutes: Routes = [
    { path: '', component: Home }, // default
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
    },
    { path: '**', redirectTo: '/', pathMatch: 'full' } // at last ...
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);