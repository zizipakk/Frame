import { RouterModule } from '@angular/router';
import { Home } from './home/home';
import { Account } from './account/account';
import { Login } from './account/login';
import { Register } from './account/register';
var appRoutes = [
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
    },
    { path: '**', redirectTo: '/', pathMatch: 'full' } // at last ...
];
export var AppRouting = RouterModule.forRoot(appRoutes);
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/app.routes.js.map