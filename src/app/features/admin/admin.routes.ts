import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { TableComponent } from '../../core/components/table/table.component';
import { FloorsComponent } from '../../core/components/organization-building/floors/floors.component';
import { UserManagementComponent } from '../../core/components/user-management/user-management.component';
import { UserRolesComponent } from '../../core/components/user-roles/user-roles.component';
import { RegionManagementComponent } from '../../core/components/region-management/region-management.component';
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
        data: { dataType: 'beds', title: 'Beds' },
      },
      {
        path: 'floors',
        component: TableComponent,
        data: { dataType: 'floors', title: 'Floors' },
      },
      {
        path: 'rooms',
        component: TableComponent,
        data: { dataType: 'rooms', title: 'Rooms' },
      },
      {
        path: 'buildings',
        component: TableComponent,
        data: { dataType: 'buildings', title: 'Buildings' },
      },
      {
        path: 'beds-summary', // Added beds-summary route
        component: TableComponent,
        data: { dataType: 'beds-summary', title: 'Beds Summary' },
      },
      {
        path: '', // Default route when organizational-building is accessed
        redirectTo: 'buildings', // Redirect to buildings as a default
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'user-management', // Corrected spelling and used kebab-case
    children: [
      // Added children for nested routes
      {
        path: 'roles',
        component: UserRolesComponent,
        data: { dataType: 'beds' },
      },
      {
        path: 'users',
        component: UserManagementComponent,
        data: { dataType: 'floors' },
      },

      {
        path: '', // Default route when organizational-building is accessed
        redirectTo: 'users', // Redirect to buildings as a default
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'region-management', // Corrected spelling and used kebab-case
    children: [
      // Added children for nested routes
      {
        path: 'countries',
        component: RegionManagementComponent,
        data: { dataType: 'Country' },
      },
      {
        path: 'countries',
        component: RegionManagementComponent,
        data: { dataType: 'Province' },
      },
    ],
  },
];
