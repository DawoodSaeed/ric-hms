import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { TableComponent } from '../../core/components/table/table.component';
import { FloorsComponent } from '../../core/components/organization-building/floors/floors.component';
export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
  },
  {
    path: 'addEmployee',
    component: AddEmployeeComponent,
  },

  {
    path: 'employees',
    component: EmployeesComponent,
  },

  {
    path: 'organizational-building', // Corrected spelling and used kebab-case
    children: [
      // Added children for nested routes
      {
        path: 'beds',
        component: TableComponent,
      },
      {
        path: 'floors',
        component: FloorsComponent,
      },
      {
        path: 'rooms',
        component: TableComponent,
      },
      {
        path: 'buildings',
        component: TableComponent,
      },
      {
        path: 'beds-summary', // Added beds-summary route
        component: TableComponent, // Assuming you'll use TableComponent or a similar one
      },
      {
        path: '', // Default route when organizational-building is accessed
        redirectTo: 'buildings', // Redirect to buildings as a default
        pathMatch: 'full',
      },
    ],
  },
];
