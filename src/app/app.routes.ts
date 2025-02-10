import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component'; // Ensure this exists
import { SidebarComponent } from './layout/sidebar/sidebar.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: 'doctor',
    loadChildren: () =>
      import('./features/doctor/doctor.routes').then((m) => m.doctorRoutes),
  },
  {
    path: 'medical-store',
    loadChildren: () =>
      import('./features/medical-store/store.routes').then(
        (m) => m.storeRoutes
      ),
  },
  { path: '**', redirectTo: 'login' },
];
