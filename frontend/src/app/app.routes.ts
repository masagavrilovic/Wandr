import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { Login } from './auth/components/login/login';
import { Register } from './auth/components/register/register';
import { Dashboard } from './trips/pages/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: LandingPage
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'dashboard',
        component: Dashboard
    }
];
