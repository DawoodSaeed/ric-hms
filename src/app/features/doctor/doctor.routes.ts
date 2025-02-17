import { Routes } from '@angular/router';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { RoleGuard } from '../../core/guards/role.guard';

export const doctorRoutes: Routes = [
  {
    path: '',
    component: DoctorDashboardComponent,
  },
];
