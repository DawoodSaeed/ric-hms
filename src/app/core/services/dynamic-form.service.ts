import { Injectable } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { FormStructure } from '../interfaces/dynamicform';
@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor(private fb: FormBuilder) {}

  createForm(formStructure: FormStructure): FormGroup {
    const formGroup = this.fb.group({});

    if (formStructure.tabs) {
      // Handle form with tabs and sections
      formStructure.tabs.forEach(tab => {
        tab.sections.forEach(section => {
          section.fields.forEach(field => {
            formGroup.addControl(
              field.name,
              this.fb.control('', field.required ? Validators.required : null)
            );
          });
        });
      });
    } else if (formStructure.fields) {
      // Handle simple flat form (no tabs, no sections)
      formStructure.fields.forEach(field => {
        formGroup.addControl(
          field.name,
          this.fb.control('', field.required ? Validators.required : null)
        );
      });
    }
    return formGroup;
  }
}


//   addEmployeeForm():FormGroup{
//     return this.fb.group({
//       // Basic Info
//       employeeStatus: ['', Validators.required],
//       active: [false],
//       title: ['', Validators.required],
//       userType: ['', Validators.required],
//       firstName: ['', Validators.required],
//       middleName: [''],
//       lastName: ['', Validators.required],
//       dateOfBirth: ['', Validators.required],
//       employeeNumber: ['', Validators.required],
//       badgeNumber: [''],
//       bloodGroup: ['', Validators.required],
//       personalNumber: [''],
//       gender: ['', Validators.required],
//       maritalStatus: ['', Validators.required],
//       guardianType: [''],
//       guardianName: [''],
//       username: ['', Validators.required],
//       password: ['', Validators.required],
//       confirmPassword: ['', Validators.required],
//       picture: [null],
//       cnicNo: ['', Validators.required],
//       passport: [''],
//       religion: [''],
//       domicile: [''],
//       electronicSignature: [null],
//       vehicleType: [''],
//       vehicleNumber: [''],
//       licenseNumber: [''],
//       // Contract Details
//       jobType: [''],
//       scale: [''],
//       costCenter: [''],
//       ntnNumber: [''],
//       appointmentDate: [''],
//       dateOfJoining: ['', Validators.required],
//       dateOfExpiry: [''],
//       personalSalary: [''],
//       basicSalary: [''],
//       salaryStage: [''],
//       gpFundNumber: [''],
//       gpOpeningBalance: [''],
//       bfAmount: [''],
//       bfDeduction: [''],
//       // Auth Details
//       roles: ['', Validators.required],
//       designations: ['', Validators.required],
//       displayDesignation: [''],
//       departments: ['', Validators.required],
//       subDepartments: [''],
//       roasterDepartment: [''],
//       lineManager: [''],
//       permissions: [''],
//       // Contact Details
//       country: ['', Validators.required],
//       stateProvince: ['', Validators.required],
//       city: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       address: [''],
//       mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
//       telephoneNo: ['', Validators.pattern('^[0-9]{11}$')],
//       // Next of Kin
//       nokFirstName: ['', Validators.required],
//       nokLastName: ['', Validators.required],
//       nokCnicNo: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
//       nokRelation: ['', Validators.required],
//     })
//   }
