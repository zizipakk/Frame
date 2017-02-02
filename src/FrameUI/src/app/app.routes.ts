import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Home } from './home/home';
import { Account } from './account/account';
import { Login } from './account/login';
import { Register } from './account/register';
import { AuthGuard } from './app.guard';

const appRoutes: Routes = [
    { path: '', component: Home, canActivate: [AuthGuard] }, // default
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
    { path: '**', redirectTo: '/', pathMatch: 'full' } // if no match url...
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
