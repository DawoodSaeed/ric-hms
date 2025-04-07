import { Routes } from '@angular/router';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { RoleGuard } from '../../core/guards/role.guard';
import { DoctorTemplateComponent } from '../../core/components/doctor-management/doctor-template/doctor-template.component';
import { PatientQueueComponent } from '../../core/components/doctor-management/patient-queue/patient-queue.component';

export const doctorRoutes: Routes = [
  {
    path: '',
    component: DoctorTemplateComponent,
  },

  {
    path: 'patient-queue',
    component: PatientQueueComponent,
  },
];
