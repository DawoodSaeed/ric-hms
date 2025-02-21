import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { DynamicFormComponent } from '../../../components/dynamic-form/dynamic-form.component';
import { FormStructure } from '../../../core/interfaces/dynamicforminterface';
import { TypeTableService } from '../../../core/services/type-table.service';
import swal from 'sweetalert2';
import {
  Country,
  EmploymentStatus,
  GuardianType,
  JobType,
  Province,
  Relation,
  Scale,
  TypeTable,
} from '../../../core/interfaces/typetable';
import { EmployeeService } from '../../../core/services/employee.service';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
// import { FormStructure } from '../../../core/interfaces/dynamicform';
@Component({
  selector: 'app-add-employee',
  imports: [DynamicFormComponent],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent implements OnInit {
  constructor(private messageService: MessageService) {}

  dropDownService = inject(TypeTableService);
  employeeService = inject(EmployeeService);
  isLoading = signal<boolean>(false);
  ngOnInit(): void {
    // Fetch and set job types
    this.dropDownService.getJobTypes().subscribe((jobtypes: JobType[]) => {
      this.updateDropdownOptions('jobTypeId', jobtypes);
    });

    // Fetch and set scales
    this.dropDownService.getScales().subscribe((scales: Scale[]) => {
      console.log('scales ', scales);
      this.updateDropdownOptions('scaleId', scales);
    });
    this.dropDownService
      .getBloodGroups()
      .subscribe((bloodgroups: TypeTable[]) => {
        console.log('bloodgroups ', bloodgroups);
        this.updateDropdownOptions('bloodGroupId', bloodgroups);
      });

    this.dropDownService
      .getGuardianTypes()
      .subscribe((guardianTypes: GuardianType[]) => {
        this.updateDropdownOptions('guadianTypeId', guardianTypes);
      });

    this.dropDownService
      .getEmploymentStatuses()
      .subscribe((empStatuses: EmploymentStatus[]) => {
        this.updateDropdownOptions('empStatusId', empStatuses);
      });

    this.dropDownService.getRelations().subscribe((relations: Relation[]) => {
      console.log('relations ',relations);
      this.updateDropdownOptions('nokrelationId', relations);
    });
    this.dropDownService.getCountries().subscribe((countries: Country[]) => {
      console.log('countries ',countries);
      this.updateDropdownOptions('country', countries);
    });

    this.dropDownService.getProvinces().subscribe((provinces: Province[]) => {
      console.log('provinces ',provinces);
      this.updateDropdownOptions('province', provinces);
    });
    
  }

  // Generic method to update dropdown options
  private updateDropdownOptions(
    fieldName: string,
    data: { id?: number; name: string }[]
  ): void {
    this.employeeFormStructure?.tabs?.forEach((tab) => {
      tab.sections.forEach((section) => {
        const field = section.fields.find((field) => field.name === fieldName);

        if (field) {
          // Filter out items with undefined `id`
          field.options = data
            .filter((item) => item.id !== undefined) // Ensure `id` is defined
            .map((item) => ({
              value: item.id as number, // Cast to `number` since `undefined` is filtered out
              label: item.name,
            }));
        }
      });
    });
  }
  // Function to detect and format date values in an object
  // Bcz we needed to conver the date objects to string to pass to API
  formatDatesInObject(obj: any): any {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];

          // Check if the value is a Date object
          if (value instanceof Date) {
            // Format the date as "YYYY-MM-DD"
            obj[key] = value.toISOString().split('T')[0];
          }

          // If it's a nested object, recurse
          else if (typeof value === 'object' && value !== null) {
            this.formatDatesInObject(value);
          }
        }
      }
    }
    return obj;
  }
  handleFormData(event: any) {
    let submittedData = event.data;
    console.log('submittedForm ', event.data);
    this.formatDatesInObject(submittedData);
    this.isLoading.set(true);
    event.apiToCall(submittedData).subscribe({
      next: (data: any) => {
      Swal.fire({
        title: 'Success!',
        text: 'Employee added successfully!',
        icon: 'success',
      });
      this.isLoading.set(false);
      },
      error: () => {
      Swal.fire({
        title: 'Oops!',
        text: 'Something went wrong! Try again.',
        icon: 'error',
      });
      this.isLoading.set(false);
      },
      complete: () => {
      console.log('Request completed');
      }
    });
    
    // this.employeeService.registerEmployee(submittedData).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     this.isLoading.set(false);
    //     swal.fire({
    //       title: 'Success!',
    //       text: 'Employee added successfully!',
    //       icon: 'success',
    //     });
    //   },
    //   error: () => {
    //     this.isLoading.set(false);
    //     swal.fire({
    //       title: 'Oops!!',
    //       text: 'Something went wrong! Try again',
    //       icon: 'error',
    //     });
    //   },
    // });
  }
  employeeFormStructure: FormStructure = {
    globalTitle: 'Add Employee', // Always shown at the top of the form
    tabs: [
      {
        tabName: 'Basic Info',
        apiToCall: this.employeeService.registerEmployee,
        sections: [
          {
            title: 'Personal Information',
            fields: [
              // { name: 'empId', label: 'Employee ID', type: 'number' },
              { name: 'firstName', label: 'First Name', type: 'text' },
              { name: 'lastName', label: 'Last Name', type: 'text' },
              { name: 'picture', label: 'Profile Picture', type: 'image' },
              { name: 'cnic', label: 'CNIC', type: 'text' },
              { name: 'passport', label: 'Passport', type: 'text' },
              { name: 'dob', label: 'Date of Birth', type: 'date' },
              { name: 'gender', label: 'Gender', type: 'text' },
              { name: 'maritalStatus', label: 'Marital Status', type: 'text' },
              { name: 'religion', label: 'Religion', type: 'text' },
              {
                name: 'bloodGroupId',
                label: 'Blood Group',
                type: 'select',
              },
              { name: 'country', label: 'Country', type: 'select' },
              { name: 'province', label: 'Province', type: 'select' },
              { name: 'cityDistrict', label: 'City/District', type: 'select' },
              { name: 'address', label: 'Address', type: 'text' },
              { name: 'mobileNo', label: 'Mobile No', type: 'text' },
              { name: 'phone', label: 'Phone', type: 'text' },
              { name: 'email', label: 'Email', type: 'text' },
              {
                name: 'jobTypeId',
                label: 'Job Type',
                type: 'select',
              },
              { name: 'empStatusId', label: 'Employee Status', type: 'select' },
              { name: 'scaleId', label: 'Scale', type: 'select' },
              {
                name: 'personalNumber',
                label: 'Personal Number',
                type: 'text',
              },
              { name: 'badgeNumber', label: 'Badge Number', type: 'text' },
              { name: 'ntn', label: 'NTN', type: 'text' },
              { name: 'licenseNumber', label: 'License Number', type: 'text' },
              {
                name: 'appointmentDate',
                label: 'Appointment Date',
                type: 'date',
              },
              { name: 'joiningDate', label: 'Joining Date', type: 'date' },
              {
                name: 'dateOfRetirement',
                label: 'Date of Retirement',
                type: 'date',
              },
              {
                name: 'domicileDistrictId',
                label: 'Domicile District',
                type: 'select',
              },
              { name: 'guadianTypeId', label: 'Guardian Type', type: 'select' },
              { name: 'guadianName', label: 'Guardian Name', type: 'text' },
              { name: 'guadianNic', label: 'Guardian NIC', type: 'text' },
              // { name: 'noktypeId', label: 'Next of Kin Type', type: 'number' },
              {
                name: 'nokrelationId',
                label: 'Next of Kin Relation',
                type: 'select',
              },
              { name: 'nokname', label: 'Next of Kin Name', type: 'text' },
              { name: 'noknic', label: 'Next of Kin NIC', type: 'text' },
              { name: 'nokmobile', label: 'Next of Kin Mobile', type: 'text' },
            ],
          },
        ],
      },
      {
        tabName: 'Awards',
        apiToCall: this.employeeService.addEmployeeAwardDetails,
        sections: [
          {
            title: 'Awards Information',
            fields: [
              // { name: 'empAwrdId', label: 'Award ID', type: 'number' },
              { name: 'name', label: 'Award Name', type: 'text' },
              { name: 'code', label: 'Award Code', type: 'text' },
              { name: 'awardedBy', label: 'Awarded By', type: 'text' },
              { name: 'description', label: 'Description', type: 'text' },
              { name: 'awardDate', label: 'Award Date', type: 'date' },
              { name: 'status', label: 'Status', type: 'radio' },
              // { name: 'createdById', label: 'Created By', type: 'number' },
              // { name: 'createdOn', label: 'Created On', type: 'date' },
              // { name: 'modifiedById', label: 'Modified By', type: 'number' },
              // { name: 'modifiedOn', label: 'Modified On', type: 'date' },
            ],
          },
        ],
      },
      {
        tabName: 'Bank Details',
        apiToCall: this.employeeService.addEmployeeBankDetails,
        sections: [
          {
            title: 'Bank Information',

            fields: [
              // { name: 'empBankId', label: 'Bank ID', type: 'number' },
              // { name: 'empId', label: 'Employee ID', type: 'number' },
              // { name: 'bankId', label: 'Bank ID', type: 'number' },
              { name: 'accountTitle', label: 'Account Title', type: 'text' },
              { name: 'accountNo', label: 'Account Number', type: 'text' },
              { name: 'branchName', label: 'Branch Name', type: 'text' },
              { name: 'branchCode', label: 'Branch Code', type: 'text' },
              { name: 'iban', label: 'IBAN', type: 'text' },
              { name: 'status', label: 'Status', type: 'radio' },
              // { name: 'createdById', label: 'Created By', type: 'number' },
              // { name: 'createdOn', label: 'Created On', type: 'date' },
              // { name: 'modifiedById', label: 'Modified By', type: 'number' },
              // { name: 'modifiedOn', label: 'Modified On', type: 'date' },
            ],
          },
        ],
      },

      {
        tabName: 'Education Info',
        apiToCall: this.employeeService.addEmployeeEducationDetails,
        sections: [
          {
            title: 'Basic Details',

            fields: [
              { name: 'empEduId', label: 'Education ID', type: 'text' },
              { name: 'empId', label: 'Employee ID', type: 'text' },
              { name: 'countryId', label: 'Country', type: 'select' },
              {
                name: 'eduIntId',
                label: 'Education Institute ID',
                type: 'text',
              },
              { name: 'degId', label: 'Degree ID', type: 'text' },
              { name: 'fsid', label: 'Field of Study ID', type: 'text' },
            ],
          },
          {
            title: 'Dates',
            fields: [
              { name: 'startDate', label: 'Start Date', type: 'text' },
              { name: 'endDate', label: 'End Date', type: 'text' },
              { name: 'issueDate', label: 'Issue Date', type: 'text' },
            ],
          },
          {
            title: 'Grading & Status',
            fields: [
              { name: 'gradingId', label: 'Grading ID', type: 'text' },
              { name: 'totalMarks', label: 'Total Marks', type: 'text' },
              { name: 'obtainMarks', label: 'Obtain Marks', type: 'text' },
              { name: 'status', label: 'Status', type: 'text' },
              { name: 'isCurrent', label: 'Is Current', type: 'text' },
            ],
          },
         
        ],
      },
      {
        tabName: 'Employee Department',

        apiToCall: this.employeeService.addEmployeeDepartmentDetails,
        sections: [
          {
            title: 'Department Info',
            fields: [
              { name: 'empDid', label: 'Employee Department ID', type: 'text' },
              { name: 'did', label: 'Department ID', type: 'text' },
              { name: 'empId', label: 'Employee ID', type: 'text' },
              { name: 'createdById', label: 'Created By', type: 'text' },
              { name: 'createdOn', label: 'Created On', type: 'text' },
              { name: 'modifiedById', label: 'Modified By', type: 'text' },
              { name: 'modifiedOn', label: 'Modified On', type: 'text' },
            ],
          },
        ],
      },
      {
        tabName: 'Employee Sub Department',

        apiToCall: this.employeeService.addEmployeesubDepartmentDetails,
        sections: [
          {
            title: 'Sub Department Info',
            fields: [
              {
                name: 'empSubDid',
                label: 'Employee Sub Department ID',
                type: 'text',
              },
              { name: 'subDid', label: 'Sub Department ID', type: 'text' },
              { name: 'empId', label: 'Employee ID', type: 'text' },
              { name: 'createdById', label: 'Created By', type: 'text' },
              { name: 'createdOn', label: 'Created On', type: 'text' },
              { name: 'modifiedById', label: 'Modified By', type: 'text' },
              { name: 'modifiedOn', label: 'Modified On', type: 'text' },
            ],
          },
        ],
      },

      {
        tabName: 'Employee Designation',
        apiToCall: this.employeeService.addEmployeeDesignationDetails,
        sections: [
          {
            title: 'Designation Info',
            fields: [
              {
                name: 'empDesgnId',
                label: 'Employee Designation ID',
                type: 'text',
              },
              { name: 'empId', label: 'Employee ID', type: 'text' },
              { name: 'desgnId', label: 'Designation ID', type: 'text' },
              { name: 'createdById', label: 'Created By', type: 'text' },
              { name: 'createdOn', label: 'Created On', type: 'text' },
              { name: 'modifiedById', label: 'Modified By', type: 'text' },
              { name: 'modifiedOn', label: 'Modified On', type: 'text' },
            ],
          },
        ],
      },
      {
        tabName: 'Employee Experience',
        apiToCall: this.employeeService.addEmployeeExpDetails,
        sections: [
          {
            title: 'Experience Info',
            fields: [
              {
                name: 'empExpId',
                label: 'Employee Experience ID',
                type: 'text',
              },
              { name: 'empId', label: 'Employee ID', type: 'text' },
              { name: 'title', label: 'Job Title', type: 'text' },
              { name: 'company', label: 'Company Name', type: 'text' },
              { name: 'description', label: 'Description', type: 'text' },
              { name: 'fromDate', label: 'From Date', type: 'text' },
              { name: 'toDate', label: 'To Date', type: 'text' },
              { name: 'status', label: 'Status', type: 'text' },
              { name: 'createdById', label: 'Created By', type: 'text' },
              { name: 'createdOn', label: 'Created On', type: 'text' },
              { name: 'modifiedById', label: 'Modified By', type: 'text' },
              { name: 'modifiedOn', label: 'Modified On', type: 'text' },
              {
                name: 'certificatePath',
                label: 'Certificate Path',
                type: 'text',
              },
            ],
          },
        ],
      },

      {
        tabName: 'Employee Facility',
        apiToCall: this.employeeService.addEmployeeFacilityDetails,
        sections: [
          {
            title: 'Facility Info',
            fields: [
              {
                name: 'empFacilityId',
                label: 'Employee Facility ID',
                type: 'text',
              },
              { name: 'empId', label: 'Employee ID', type: 'text' },
              { name: 'facilityId', label: 'Facility ID', type: 'text' },
              { name: 'createdById', label: 'Created By', type: 'text' },
              { name: 'createdOn', label: 'Created On', type: 'text' },
              { name: 'modifiedById', label: 'Modified By', type: 'text' },
              { name: 'modifiedOn', label: 'Modified On', type: 'text' },
            ],
          },
        ],
      },
      {
        tabName: 'Employee Speciality',
        apiToCall: this.employeeService.addEmployeeSpecialityDetails,
        sections: [
          {
            title: 'Speciality Info',
            fields: [
              {
                name: 'empSpId',
                label: 'Employee Speciality ID',
                type: 'text',
              },
              { name: 'empId', label: 'Employee ID', type: 'text' },
              { name: 'spId', label: 'Speciality ID', type: 'text' },
              { name: 'status', label: 'Status', type: 'text' },
              { name: 'createdById', label: 'Created By', type: 'text' },
              { name: 'createdOn', label: 'Created On', type: 'text' },
              { name: 'modifiedById', label: 'Modified By', type: 'text' },
              { name: 'modifiedOn', label: 'Modified On', type: 'text' },
            ],
          },
        ],
      },
      {
        tabName: 'Employee Subspeciality',
        apiToCall: this.employeeService.addEmployeeSubSpecialityDetails,
        sections: [
          {
            title: 'Subspeciality Info',
            fields: [
              {
                name: 'empSubSpId',
                label: 'Employee Subspeciality ID',
                type: 'text',
              },
              { name: 'empId', label: 'Employee ID', type: 'text' },
              { name: 'subSpId', label: 'Subspeciality ID', type: 'text' },
              { name: 'status', label: 'Status', type: 'text' },
              { name: 'createdById', label: 'Created By', type: 'text' },
              { name: 'createdOn', label: 'Created On', type: 'text' },
              { name: 'modifiedById', label: 'Modified By', type: 'text' },
              { name: 'modifiedOn', label: 'Modified On', type: 'text' },
            ],
          },
        ],
      },
    ],
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
