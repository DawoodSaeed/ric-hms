import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { RoleGuard } from '../../core/guards/role.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
  },
];
