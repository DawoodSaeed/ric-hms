import { Component } from '@angular/core';
import { DynamicFormComponent } from '../../../components/dynamic-form/dynamic-form.component';
import { FormStructure } from '../../../core/interfaces/dynamicform';
// import { FormStructure } from '../../../core/interfaces/dynamicform';
@Component({
  selector: 'app-add-employee',
  imports: [DynamicFormComponent],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  employeeFormStructure: FormStructure = {
    globalTitle: "Add Employee",
    fields: [
      { name: "empId", label: "Employee ID", type: "text" },
      { name: "firstName", label: "First Name", type: "text" },
      { name: "lastName", label: "Last Name", type: "text" },
      { name: "cnic", label: "CNIC", type: "text" },
      { name: "passport", label: "Passport", type: "text" },
      { name: "dob", label: "Date of Birth", type: "text" },
      { name: "gender", label: "Gender", type: "text" },
      { name: "maritalStatus", label: "Marital Status", type: "text" },
      { name: "religion", label: "Religion", type: "text" },
      { name: "bloodGroupId", label: "Blood Group", type: "text" },
      { name: "country", label: "Country", type: "text" },
      { name: "province", label: "Province", type: "text" },
      { name: "cityDistrict", label: "City/District", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "mobileNo", label: "Mobile No", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "jobTypeId", label: "Job Type", type: "text" },
      { name: "empStatusId", label: "Employment Status", type: "text" },
      { name: "scaleId", label: "Scale", type: "text" },
      { name: "personalNumber", label: "Personal Number", type: "text" },
      { name: "badgeNumber", label: "Badge Number", type: "text" },
      { name: "ntn", label: "NTN", type: "text" },
      { name: "licenseNumber", label: "License Number", type: "text" },
      { name: "appointmentDate", label: "Appointment Date", type: "text" },
      { name: "joiningDate", label: "Joining Date", type: "text" },
      { name: "dateOfRetirement", label: "Date of Retirement", type: "text" },
      { name: "domicileDistrictId", label: "Domicile District", type: "text" },
      { name: "guadianTypeId", label: "Guardian Type", type: "text" },
      { name: "guadianName", label: "Guardian Name", type: "text" },
      { name: "guadianNic", label: "Guardian NIC", type: "text" },
      { name: "noktypeId", label: "NOK Type", type: "text" },
      { name: "nokrelationId", label: "NOK Relation", type: "text" },
      { name: "nokname", label: "NOK Name", type: "text" },
      { name: "noknic", label: "NOK NIC", type: "text" },
      { name: "nokmobile", label: "NOK Mobile", type: "text" },
      { name: "picture", label: "Picture URL", type: "text" },
      { name: "createdById", label: "Created By", type: "text" },
      { name: "createdOn", label: "Created On", type: "text" },
      { name: "modifiedById", label: "Modified By", type: "text" },
      { name: "modifiedOn", label: "Modified On", type: "text" }
    ]
  }
  
}
