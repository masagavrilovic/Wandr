import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './trips/pages/dashboard/dashboard';
import { Register } from './auth/register/register';
import { authGuard, guestGuard } from './auth/auth.guards';
import { CreateTrip } from './trips/pages/create-trip/create-trip';
import { LandingPage } from './landing-page/landing-page';
import { TripOverview } from './trips/pages/trip-overview/trip-overview';
import { ItineraryMap } from './activities/itinerary-map/itinerary-map';

export const routes: Routes = [
    { path: '', component: LandingPage, canActivate: [guestGuard] },
    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'register', component: Register, canActivate: [guestGuard] },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'create-trip', component: CreateTrip, canActivate: [authGuard] },
    { 
        path: 'trips/:id', 
        component: TripOverview, 
        canActivate: [authGuard],
        children: [
                { path: '', redirectTo: 'itinerary', pathMatch: 'full' },
                { path: 'itinerary', component: ItineraryMap },
            ] 
    },
];
