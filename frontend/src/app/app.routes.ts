import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'customers', component: CustomerManagementComponent, canActivate: [MsalGuard] },
  { path: '**', redirectTo: '' }
];
