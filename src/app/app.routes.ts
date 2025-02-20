import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component'; // Ensure this exists
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RoleGuard } from './core/guards/role.guard';
import { AuthGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.adminRoutes),
    canActivate: [RoleGuard],
    data: { role: 'Admin' },
  },
  {
    path: 'doctor',
    loadChildren: () =>
      import('./features/doctor/doctor.routes').then((m) => m.doctorRoutes),
    data: { role: 'doctor' },
    canActivate: [RoleGuard],
  },
  {
    path: 'medical-store',
    loadChildren: () =>
      import('./features/medical-store/store.routes').then(
        (m) => m.storeRoutes
      ),
    canActivate: [RoleGuard],
    data: { role: 'medical-store' },
  },
];
