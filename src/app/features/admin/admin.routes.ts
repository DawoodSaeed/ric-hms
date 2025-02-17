import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { RoleGuard } from '../../core/guards/role.guard';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
  },
  {
    path: 'addEmployee',
    component: AddEmployeeComponent,
  },
];
