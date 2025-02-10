import { Routes } from '@angular/router';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { RoleGuard } from '../../core/role.guard';

export const doctorRoutes: Routes = [
  {
    path: '',
    component: DoctorDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'doctor' },
  },
];
