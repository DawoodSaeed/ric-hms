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
  employeeFormStructure: FormStructure ={
      globalTitle: "Add Employee", // Always shown at the top of the form
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

  // Section Based
  // employeeFormStructure: FormStructure = {
  //     globalTitle: "Add Emoloyee", // Always shown at the top of the form
  //     sections: [
  //       {
  //         title: "Personal Information",
  //         fields: [
  //           { name: "firstName", label: "First Name", type: "text" },
  //           { name: "lastName", label: "Last Name", type: "text" },
  //           { name: "dob", label: "Date of Birth", type: "text" }
  //         ]
  //       },
  //       {
  //         title: "Contact Information",
  //         fields: [
  //           { name: "email", label: "Email", type: "text" },
  //           { name: "phone", label: "Phone", type: "text" }
  //         ]
  //       },
  //       {
  //         title: "Job Information",
  //         fields: [
  //           {
  //             name: "jobType",
  //             label: "Job Type",
  //             type: "select",
  //             options: [
  //               { value: "full-time", label: "Full-Time" },
  //               { value: "part-time", label: "Part-Time" }
  //             ]
  //           },
  //           { name: "ntnNumber", label: "NTN Number", type: "text" }
  //         ]
  //       }
  //     ]
  //   };


  // Simple
  // employeeFormStructure: FormStructure = {
  //   globalTitle: "Add Employee", // Always shown at the top of the form
  //   fields: [
  //     { name: "firstName", label: "First Name", type: "text" },
  //     { name: "lastName", label: "Last Name", type: "text" },
  //     { name: "email", label: "Email", type: "text" },
  //     { name: "phone", label: "Phone", type: "text" },
  //     {
  //       name: "jobType",
  //       label: "Job Type",
  //       type: "select",
  //       options: [
  //         { value: "full-time", label: "Full-Time" },
  //         { value: "part-time", label: "Part-Time" }
  //       ]
  //     },
  //     { name: "ntnNumber", label: "NTN Number", type: "text" },
  //     { name: "address", label: "Address", type: "text" }, // New field for address
  //     { name: "dateOfBirth", label: "Date of Birth", type: "date" }, // New field for DOB
  //     { name: "hireDate", label: "Hire Date", type: "date" }, // New field for hire date
  //     { name: "salary", label: "Salary", type: "number" }, // New field for salary
  //     { name: "department", label: "Department", type: "select", options: [
  //         { value: "hr", label: "HR" },
  //         { value: "engineering", label: "Engineering" },
  //         { value: "marketing", label: "Marketing" },
  //         { value: "sales", label: "Sales" }
  //       ] // New field for department
  //     },
  //     { name: "status", label: "Status", type: "select", options: [
  //         { value: "active", label: "Active" },
  //         { value: "inactive", label: "Inactive" }
  //       ] // New field for employee status
  //     }
  //   ]
  // };
  
    
}
