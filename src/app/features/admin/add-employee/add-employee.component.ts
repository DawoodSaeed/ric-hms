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
    globalTitle: "Add Employee",
    fields: [
      { "name": "empId", "label": "Employee ID", "type": "text", "placeholder": "Enter Employee ID" },
      { "name": "firstName", "label": "First Name", "type": "text", "placeholder": "Enter First Name" },
      { "name": "lastName", "label": "Last Name", "type": "text", "placeholder": "Enter Last Name" },
      { "name": "cnic", "label": "CNIC", "type": "text", "placeholder": "Enter CNIC" },
      { "name": "passport", "label": "Passport", "type": "text", "placeholder": "Enter Passport Number" },
      { "name": "dob", "label": "Date of Birth", "type": "text", "placeholder": "Enter Date of Birth" },
      { "name": "gender", "label": "Gender", "type": "text", "placeholder": "Enter Gender" },
      { "name": "maritalStatus", "label": "Marital Status", "type": "text", "placeholder": "Enter Marital Status" },
      { "name": "religion", "label": "Religion", "type": "text", "placeholder": "Enter Religion" },
      { "name": "bloodGroupId", "label": "Blood Group", "type": "text", "placeholder": "Enter Blood Group" },
      { "name": "country", "label": "Country", "type": "text", "placeholder": "Enter Country" },
      { "name": "province", "label": "Province", "type": "text", "placeholder": "Enter Province" },
      { "name": "cityDistrict", "label": "City/District", "type": "text", "placeholder": "Enter City/District" },
      { "name": "address", "label": "Address", "type": "text", "placeholder": "Enter Address" },
      { "name": "mobileNo", "label": "Mobile No", "type": "text", "placeholder": "Enter Mobile Number" },
      { "name": "phone", "label": "Phone", "type": "text", "placeholder": "Enter Phone Number" },
      { "name": "email", "label": "Email", "type": "text", "placeholder": "Enter Email" },
      { "name": "jobTypeId", "label": "Job Type", "type": "text", "placeholder": "Enter Job Type" },
      { "name": "empStatusId", "label": "Employment Status", "type": "text", "placeholder": "Enter Employment Status" },
      { "name": "scaleId", "label": "Scale", "type": "text", "placeholder": "Enter Scale" },
      { "name": "personalNumber", "label": "Personal Number", "type": "text", "placeholder": "Enter Personal Number" },
      { "name": "badgeNumber", "label": "Badge Number", "type": "text", "placeholder": "Enter Badge Number" },
      { "name": "ntn", "label": "NTN", "type": "text", "placeholder": "Enter NTN" },
      { "name": "licenseNumber", "label": "License Number", "type": "text", "placeholder": "Enter License Number" },
      { "name": "appointmentDate", "label": "Appointment Date", "type": "text", "placeholder": "Enter Appointment Date" },
      { "name": "joiningDate", "label": "Joining Date", "type": "text", "placeholder": "Enter Joining Date" },
      { "name": "dateOfRetirement", "label": "Date of Retirement", "type": "text", "placeholder": "Enter Date of Retirement" },
      { "name": "domicileDistrictId", "label": "Domicile District", "type": "text", "placeholder": "Enter Domicile District" },
      { "name": "guadianTypeId", "label": "Guardian Type", "type": "text", "placeholder": "Enter Guardian Type" },
      { "name": "guadianName", "label": "Guardian Name", "type": "text", "placeholder": "Enter Guardian Name" },
      { "name": "guadianNic", "label": "Guardian NIC", "type": "text", "placeholder": "Enter Guardian NIC" },
      { "name": "noktypeId", "label": "NOK Type", "type": "text", "placeholder": "Enter NOK Type" },
      { "name": "nokrelationId", "label": "NOK Relation", "type": "text", "placeholder": "Enter NOK Relation" },
      { "name": "nokname", "label": "NOK Name", "type": "text", "placeholder": "Enter NOK Name" },
      { "name": "noknic", "label": "NOK NIC", "type": "text", "placeholder": "Enter NOK NIC" },
      { "name": "nokmobile", "label": "NOK Mobile", "type": "text", "placeholder": "Enter NOK Mobile" },
      { "name": "picture", "label": "Picture URL", "type": "text", "placeholder": "Enter Picture URL" },
      { "name": "createdById", "label": "Created By", "type": "text", "placeholder": "Enter Creator ID" },
      { "name": "createdOn", "label": "Created On", "type": "text", "placeholder": "Enter Creation Date" },
      { "name": "modifiedById", "label": "Modified By", "type": "text", "placeholder": "Enter Modifier ID" },
      { "name": "modifiedOn", "label": "Modified On", "type": "text", "placeholder": "Enter Modification Date" }
    ]
    
  }
  
}
