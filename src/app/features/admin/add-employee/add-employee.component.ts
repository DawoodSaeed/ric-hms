import { Component } from '@angular/core';
import { DynamicFormComponent } from '../../../components/dynamic-form/dynamic-form.component';
import { FormStructure } from '../../../core/interfaces/dynamicform';
@Component({
  selector: 'app-add-employee',
  imports: [DynamicFormComponent],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  employeeFormStructure: FormStructure = {
    title: 'Add Employee',
    tabs: [
      {
        tabName: 'Basic Info',
        fields: [
          { name: 'employeeStatus', type: 'text', label: 'Employee Status', required: true },
          { name: 'title', type: 'text', label: 'Title', required: true },
          { name: 'userType', type: 'text', label: 'User Type', required: true },
          { name: 'firstName', type: 'text', label: 'First Name', required: true },
          { name: 'middleName', type: 'text', label: 'Middle Name' }
        ],
      },
      {
        tabName: 'Contract Details',
        fields: [
          { name: 'jobType', type: 'text', label: 'Job Type' },
          { name: 'scale', type: 'text', label: 'Scale' },
          { name: 'costCenter', type: 'text', label: 'Cost Center' },
          { name: 'ntnNumber', type: 'text', label: 'NTN Number' },
          { name: 'appointmentDate', type: 'text', label: 'Appointment Date' }
        ],
      },
      {
        tabName: 'Authorization Details',
        fields: [
          { name: 'roles', type: 'text', label: 'Roles', required: true },
          { name: 'designations', type: 'text', label: 'Designations', required: true },
          { name: 'departments', type: 'text', label: 'Departments', required: true },
          { name: 'subDepartments', type: 'text', label: 'Sub Departments' }
        ],
      }
    ]
  };

}
