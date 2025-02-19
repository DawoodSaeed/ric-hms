import { Component } from '@angular/core';
import { DynamicFormComponent } from '../../../components/dynamic-form/dynamic-form.component';
import { FormStructure } from '../../../core/interfaces/dynamicforminterface';
// import { FormStructure } from '../../../core/interfaces/dynamicform';
@Component({
  selector: 'app-add-employee',
  imports: [DynamicFormComponent],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  employeeFormStructure: FormStructure = {
      globalTitle: "Employee Details", // Always shown at the top of the form
      tabs: [
        {
          tabName: "Basic Info",
          sections: [
            {
              title: "Personal Information",
              fields: [
                { name: "firstName", label: "First Name", type: "text" },
                { name: "lastName", label: "Last Name", type: "text" },
                { name: "dob", label: "Date of Birth", type: "text" }
              ]
            },
            {
              title: "Contact Information",
              fields: [
                { name: "email", label: "Email", type: "text" },
                { name: "phone", label: "Phone", type: "text" }
              ]
            }
          ]
        },
        {
          tabName: "Job Details",
          sections: [
            {
              title: "Contract Information",
              fields: [
                {
                  name: "jobType",
                  label: "Job Type",
                  type: "select",
                  options: [
                    { value: "full-time", label: "Full-Time" },
                    { value: "part-time", label: "Part-Time" }
                  ]
                },
                { name: "ntnNumber", label: "NTN Number", type: "text" }
              ]
            }
          ]
        }
      ]
    };
    
  
}
