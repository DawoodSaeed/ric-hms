import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { TableComponent } from '../../core/components/table/table.component';
import { FloorsComponent } from '../../core/components/organization-building/floors/floors.component';
import { UserManagementComponent } from '../../core/components/user-management/user-management.component';
import { UserRolesComponent } from '../../core/components/user-roles/user-roles.component';
import { RegionManagementComponent } from '../../core/components/region-management/region-management.component';
import { RoasterComponent } from '../../core/components/roaster/roaster.component';
import { AssignStaffComponent } from '../../core/components/roaster/assign-staff/assign-staff.component';
import { ViewDutiesComponent } from '../../core/components/roaster/view-duties/view-duties.component';
import { PatientRegistrationComponent } from '../../core/components/patient-registration/patient-registration.component';
import { DoctorDashboardComponent } from '../doctor/doctor-dashboard.component';
import { DoctorsComponent } from '../../core/components/doctor-management/doctors/doctors.component';
import { PatientCheckinComponent } from '../../core/components/patient-checkin/patient-checkin.component';
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
    path: 'roaster',
    component: RoasterComponent,
  },

  {
    path: 'roaster',
    component: RoasterComponent,
  },

  {
    path: 'roaster/assign-staff/:roasterId',
    component: AssignStaffComponent,
  },

  {
    path: 'roaster/view-duties/:roasterId',
    component: ViewDutiesComponent,
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
        data: { dataType: 'Country', title: 'Countries' },
      },
      {
        path: 'provinces',
        component: RegionManagementComponent,
        data: { dataType: 'Province', title: 'Provinces' },
      },
      {
        path: 'districts',
        component: RegionManagementComponent,
        data: { dataType: 'District', title: 'Districts' },
      },
      {
        path: 'cities',
        component: RegionManagementComponent,
        data: { dataType: 'City', title: 'Cities' },
      },
      {
        path: 'religions',
        component: RegionManagementComponent,
        data: { dataType: 'Religion', title: 'Religions' },
      },
      {
        path: 'educationDegrees',
        component: RegionManagementComponent,
        data: { dataType: 'Degree', title: 'Degrees' },
      },
      {
        path: 'educationInstitutes',
        component: RegionManagementComponent,
        data: { dataType: 'Institue', title: 'Institutes' },
      },
      {
        path: 'educationInstitutes',
        component: RegionManagementComponent,
        data: { dataType: 'Institue', title: 'Institutes' },
      },
      {
        path: 'designations',
        component: RegionManagementComponent,
        data: { dataType: 'Designation', title: 'Designations' },
      },
      {
        path: 'departments',
        component: RegionManagementComponent,
        data: { dataType: 'Department', title: 'Departments' },
      },
      {
        path: 'departmentCats',
        component: RegionManagementComponent,
        data: { dataType: 'deptCats', title: 'Department Categories' },
      },
      {
        path: 'orgTypes',
        component: RegionManagementComponent,
        data: { dataType: 'orgTypes', title: 'Organization Types' },
      },
      {
        path: 'jobTypes',
        component: RegionManagementComponent,
        data: { dataType: 'jobTypes', title: 'Job Types' },
      },
      {
        path: 'patientTypes',
        component: RegionManagementComponent,
        data: { dataType: 'patientTypes', title: 'Patient Types' },
      },
      {
        path: 'patientCheckInStatus',
        component: RegionManagementComponent,
        data: {
          dataType: 'patientCheckInStatus',
          title: 'Patient CheckIn Status',
        },
      },
      {
        path: 'checkInTypes',
        component: RegionManagementComponent,
        data: {
          dataType: 'checkInTypes',
          title: 'CheckIn Types',
        },
      },
      {
        path: 'guardianTypes',
        component: RegionManagementComponent,
        data: {
          dataType: 'guardianTypes',
          title: 'Guardian Types',
        },
      },
      {
        path: 'bloodGroups',
        component: RegionManagementComponent,
        data: {
          dataType: 'bloodGroups',
          title: 'Blood Groups',
        },
      },
      {
        path: 'paymentmethods',
        component: RegionManagementComponent,
        data: {
          dataType: 'paymentmethods',
          title: 'Payment Methods',
        },
      },
      {
        path: 'discountTypes',
        component: RegionManagementComponent,
        data: {
          dataType: 'discountTypes',
          title: 'Discount Types',
        },
      },
      {
        path: 'chargesTypes',
        component: RegionManagementComponent,
        data: {
          dataType: 'chargesTypes',
          title: 'Charges Types',
        },
      },
      {
        path: 'banks',
        component: RegionManagementComponent,
        data: {
          dataType: 'Bank',
          title: 'Banks',
        },
      },
    ],
  },
  {
    path: 'patient-management', // Corrected spelling and used kebab-case
    children: [
      // Added children for nested routes
      {
        path: 'registration',
        component: PatientRegistrationComponent,
      },
      {
        path: 'checkin',
        component: PatientCheckinComponent,
      },
    ],
  },
];
