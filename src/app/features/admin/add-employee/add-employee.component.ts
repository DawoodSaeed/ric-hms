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
    globalTitle: "Add Employee", // Always shown at the top of the form
    tabs: [
      {
        tabName: "Basic Info",
        sections: [
          {
            title: "Personal Information",
            fields: [
              { name: "empId", label: "Employee ID", type: "number" },
              { name: "firstName", label: "First Name", type: "text" },
              { name: "lastName", label: "Last Name", type: "text" },
              { name: "cnic", label: "CNIC", type: "text" },
              { name: "passport", label: "Passport", type: "text" },
              { name: "dob", label: "Date of Birth", type: "date" },
              { name: "gender", label: "Gender", type: "text" },
              { name: "maritalStatus", label: "Marital Status", type: "text" },
              { name: "religion", label: "Religion", type: "text" },
              { name: "bloodGroupId", label: "Blood Group", type: "number" },
              { name: "country", label: "Country", type: "number" },
              { name: "province", label: "Province", type: "number" },
              { name: "cityDistrict", label: "City/District", type: "number" },
              { name: "address", label: "Address", type: "text" },
              { name: "mobileNo", label: "Mobile No", type: "text" },
              { name: "phone", label: "Phone", type: "text" },
              { name: "email", label: "Email", type: "text" },
              { name: "jobTypeId", label: "Job Type", type: "number" },
              { name: "empStatusId", label: "Employee Status", type: "number" },
              { name: "scaleId", label: "Scale", type: "number" },
              { name: "personalNumber", label: "Personal Number", type: "text" },
              { name: "badgeNumber", label: "Badge Number", type: "text" },
              { name: "ntn", label: "NTN", type: "text" },
              { name: "licenseNumber", label: "License Number", type: "text" },
              { name: "appointmentDate", label: "Appointment Date", type: "date" },
              { name: "joiningDate", label: "Joining Date", type: "date" },
              { name: "dateOfRetirement", label: "Date of Retirement", type: "date" },
              { name: "domicileDistrictId", label: "Domicile District", type: "number" },
              { name: "guadianTypeId", label: "Guardian Type", type: "number" },
              { name: "guadianName", label: "Guardian Name", type: "text" },
              { name: "guadianNic", label: "Guardian NIC", type: "text" },
              { name: "noktypeId", label: "Next of Kin Type", type: "number" },
              { name: "nokrelationId", label: "Next of Kin Relation", type: "number" },
              { name: "nokname", label: "Next of Kin Name", type: "text" },
              { name: "noknic", label: "Next of Kin NIC", type: "text" },
              { name: "nokmobile", label: "Next of Kin Mobile", type: "text" },
              { name: "picture", label: "Picture", type: "text" },
              { name: "createdById", label: "Created By", type: "number" },
              { name: "createdOn", label: "Created On", type: "date" },
              { name: "modifiedById", label: "Modified By", type: "number" },
              { name: "modifiedOn", label: "Modified On", type: "date" }
            ]
          }
        ]
      },
      {
        tabName: "Awards",
        sections: [
          {
            title: "Awards Information",
            fields: [
              { name: "empAwrdId", label: "Award ID", type: "number" },
              { name: "name", label: "Award Name", type: "text" },
              { name: "code", label: "Award Code", type: "text" },
              { name: "awardedBy", label: "Awarded By", type: "text" },
              { name: "description", label: "Description", type: "text" },
              { name: "awardDate", label: "Award Date", type: "date" },
              { name: "status", label: "Status", type: "number" },
              { name: "createdById", label: "Created By", type: "number" },
              { name: "createdOn", label: "Created On", type: "date" },
              { name: "modifiedById", label: "Modified By", type: "number" },
              { name: "modifiedOn", label: "Modified On", type: "date" }
            ]
          }
        ]
      },
      {
        tabName: "Bank Details",
        sections: [
          {
            title: "Bank Information",
            fields: [
              { name: "empBankId", label: "Bank ID", type: "number" },
              { name: "empId", label: "Employee ID", type: "number" },
              { name: "bankId", label: "Bank ID", type: "number" },
              { name: "accountTitle", label: "Account Title", type: "text" },
              { name: "accountNo", label: "Account Number", type: "text" },
              { name: "branchName", label: "Branch Name", type: "text" },
              { name: "branchCode", label: "Branch Code", type: "text" },
              { name: "iban", label: "IBAN", type: "text" },
              { name: "status", label: "Status", type: "number" },
              { name: "createdById", label: "Created By", type: "number" },
              { name: "createdOn", label: "Created On", type: "date" },
              { name: "modifiedById", label: "Modified By", type: "number" },
              { name: "modifiedOn", label: "Modified On", type: "date" }
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
