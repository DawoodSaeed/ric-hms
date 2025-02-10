import { Routes } from '@angular/router';
import { StoreDashboardComponent } from './store-dashboard.component';
import { RoleGuard } from '../../core/role.guard';

export const storeRoutes: Routes = [
  {
    path: '',
    component: StoreDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'store' },
  },
];
