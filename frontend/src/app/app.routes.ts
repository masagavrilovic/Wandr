import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { Register } from './auth/register/register';
import { authGuard, guestGuard } from './auth/auth.guards';
import { LandingPage } from './landing-page/landing-page/landing-page';

export const routes: Routes = [
    { path: '', component: LandingPage, canActivate: [guestGuard] },
    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'register', component: Register, canActivate: [guestGuard] },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
];
