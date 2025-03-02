import { OrganisationService } from './../../../core/services/organisation.service';
import {
  Component,
  Inject,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { DynamicFormComponent } from '../../../components/dynamic-form/dynamic-form.component';
import { FormStructure } from '../../../core/interfaces/dynamicforminterface';
import { TypeTableService } from '../../../core/services/type-table.service';
import swal from 'sweetalert2';
import {
  Bank,
  Country,
  Designation,
  District,
  EducationDegree,
  EducationInstitution,
  EmploymentStatus,
  Facility,
  FieldOfStudy,
  Grades,
  GuardianType,
  JobType,
  Province,
  Relation,
  Religion,
  Scale,
  Speciality,
  SubSpeciality,
  TypeTable,
} from '../../../core/interfaces/typetable';
import { EmployeeService } from '../../../core/services/employee.service';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { Department, SubDepartment } from '../../../core/interfaces/organisation';
// import { FormStructure } from '../../../core/interfaces/dynamicform';
@Component({
  selector: 'app-add-employee',
  imports: [DynamicFormComponent],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private messageService: MessageService,
  ) {}
  subscriptions: Subscription[] = [];
  dropDownService = inject(TypeTableService);
  employeeService = inject(EmployeeService);
  organizationService=inject(OrganisationService)
  isLoading = signal<boolean>(false);
  ngOnInit(): void {
    this.fetchDropdowns();

    this.fetchTableData();
  }

  fetchTableData() {
    const dataMap: {
      [key: string]: { fetchData: () => void; dataStream: Observable<any[]> };
    } = {
      Awards: {
        fetchData: () => this.employeeService.getEmployeeAwardDetails(),
        dataStream: this.employeeService.employeeAwards$,
      },
      'Bank Details': {
        fetchData: () => this.employeeService.getEmployeeBankDetails(),
        dataStream: this.employeeService.bankDetails$,
      },
      'Education Info': {
        fetchData: () => this.employeeService.getEmployeeEducationDetails(),
        dataStream: this.employeeService.education$,
      },
      'Employee Department': {
        fetchData: () => this.employeeService.getEmployeeDepartmentDetails(),
        dataStream: this.employeeService.department$,
      },
      'Employee Sub Department': {
        fetchData: () => this.employeeService.getEmployeeSubDepartmentDetails(),
        dataStream: this.employeeService.subDepartment$,
      },
      'Employee Designation': {
        fetchData: () => this.employeeService.getEmployeeDesignationDetails(),
        dataStream: this.employeeService.designation$,
      },
      'Employee Experience': {
        fetchData: () => this.employeeService.getEmployeeExperienceDetails(),
        dataStream: this.employeeService.experience$,
      },
      'Employee Facility': {
        fetchData: () => this.employeeService.getEmployeeFacilityDetails(),
        dataStream: this.employeeService.facility$,
      },
      'Employee Speciality': {
        fetchData: () => this.employeeService.getEmployeeSpecialityDetails(),
        dataStream: this.employeeService.speciality$,
      },
      'Employee Subspeciality': {
        fetchData: () => this.employeeService.getEmployeeSubSpecialityDetails(),
        dataStream: this.employeeService.subSpeciality$,
      },
    };

    this.employeeFormStructure.tabs?.forEach((tab) => {
      if (dataMap[tab.tabName]) {
        dataMap[tab.tabName].fetchData();

        const subscription = dataMap[tab.tabName].dataStream.subscribe(
          (data: any[]) => {
            tab.tableData = data;
          }
        );

        tab.dataSubscription = subscription; // Store it in the tab object (optional)
        this.subscriptions.push(subscription); // Store in the array for cleanup
      }
    });
  }

  fetchDropdowns() {
    
    // Fetch and set job types
    this.dropDownService.getJobTypes().subscribe((jobtypes: JobType[]) => {
      this.updateDropdownOptions('jobTypeId', jobtypes);
    });
    // Fetch and set job types
    this.dropDownService.getReligions().subscribe((religions: Religion[]) => {
      console.log('religions ',religions)
      this.updateDropdownOptions('religion', religions);
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
      console.log('relations ', relations);
      this.updateDropdownOptions('nokrelationId', relations);
    });
    this.dropDownService.getCountries().subscribe((countries: Country[]) => {
      console.log('countries ', countries);
      this.updateDropdownOptions('country', countries);
      this.updateDropdownOptions('countryId', countries);
    });

    this.dropDownService.getProvinces().subscribe((provinces: Province[]) => {
      console.log('provinces ', provinces);
      this.updateDropdownOptions('province', provinces);
    });
    this.dropDownService.getDistricts().subscribe((districts: District[]) => {
      console.log('domicileDistrictId ', districts);
      this.updateDropdownOptions('domicileDistrictId', districts);
      this.updateDropdownOptions('cityDistrict', districts);

    });
    this.dropDownService
      .getEducationInstitutions()
      .subscribe((eduInstitutes: EducationInstitution[]) => {
        console.log('eduIntId', eduInstitutes);
        this.updateDropdownOptions('eduIntId', eduInstitutes);
      });
    this.dropDownService
      .getFieldOfStudies()
      .subscribe((fieldOfStudes: FieldOfStudy[]) => {
        console.log('fsid', fieldOfStudes);
        this.updateDropdownOptions('fsid', fieldOfStudes);
      });
    this.dropDownService
      .getEducationDegrees()
      .subscribe((degrees: EducationDegree[]) => {
        this.updateDropdownOptions('degId', degrees);
      });

    this.dropDownService
      .getBanks()
      .subscribe((banks: Bank[]) => {
        this.updateDropdownOptions('bankId', banks);
      });

      this.organizationService.getAllDepartments().subscribe((departments: Department[]) => {
        this.updateDropdownOptions('did', departments);
      });

      this.organizationService.getAllSubDepartments().subscribe((subDepartments: SubDepartment[]) => {
        console.log('subDepartments',subDepartments)
        this.updateDropdownOptions('subDid', subDepartments);
      });
      this.dropDownService
      .getDesignations()
      .subscribe((designations: Designation[]) => {
        this.updateDropdownOptions('desgnId', designations);
      });
      this.dropDownService.getFacilities().subscribe((facilities: Facility[]) => {
        console.log('facilities', facilities);
        this.updateDropdownOptions('facilityId', facilities);
      });

      this.dropDownService.getSpeciality().subscribe((specialities: Speciality[]) => {
        console.log('spId', specialities);
        this.updateDropdownOptions('spId', specialities);
      });
      this.dropDownService.getSubSpeciality().subscribe((subSpecialities: SubSpeciality[]) => {
        console.log('subSpId', subSpecialities);
        this.updateDropdownOptions('subSpId', subSpecialities);
      });
      this.dropDownService.getGrades().subscribe((grades: Grades[]) => {
        console.log('gradingId', grades);
        this.updateDropdownOptions('gradingId', grades);
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
    event.apiToCall(submittedData,event.isEdit,event.isDelete).subscribe({
      next: (data: any) => {
        this.notificationService.showSuccess('Operation successful!');


        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.showError('Error! Please Try Again');

        this.isLoading.set(false);
      },
      complete: () => {
        console.log('Request completed');
      },
    });
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
              { name: 'firstName', label: 'First Name', type: 'text' ,required:true},
              { name: 'lastName', label: 'Last Name', type: 'text' },
              { name: 'picture', label: 'Profile Picture', type: 'image' },
              { name: 'cnic', label: 'CNIC', type: 'text' },
              { name: 'passport', label: 'Passport', type: 'text' },
              { name: 'dob', label: 'Date of Birth', type: 'date',required:true },
              { name: 'gender', label: 'Gender', type: 'select',required:true ,options:[{value:'Male',label:'Male'},{value:'Female',label:'Female'}]},
              { name: 'maritalStatus', label: 'Marital Status', type: 'select',required:true,options:[{value:'Single',label:'Single'},{value:'Married',label:'Married'},{value:'Divorced',label:'Divorced'},{value:'Widow',label:'Widow'}]},
              { name: 'religion', label: 'Religion', type: 'select', required:true},
              {
                name: 'bloodGroupId',
                label: 'Blood Group',
                type: 'select',
              },
              { name: 'country', label: 'Country', type: 'select',required:true },
              { name: 'province', label: 'Province', type: 'select' ,required:true},
              { name: 'cityDistrict', label: 'City/District', type: 'select' },
              { name: 'address', label: 'Address', type: 'text',required:true },
              { name: 'mobileNo', label: 'Mobile No', type: 'text',required:true },
              { name: 'phone', label: 'Phone', type: 'text' },
              { name: 'email', label: 'Email', type: 'text' },
              {
                name: 'jobTypeId',
                label: 'Job Type',
                type: 'select',
              },
              { name: 'empStatusId', label: 'Employee Status', type: 'select' ,required:true},
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

        tableData: [],
        showTable: true,

        sections: [
          {
            title: 'Awards Information',
            fields: [
              // { name: 'empAwrdId', label: 'Award ID', type: 'number' },
              { name: 'name', label: 'Award Name', type: 'text' ,required:true},
              { name: 'code', label: 'Award Code', type: 'text' ,required:true},
              { name: 'awardedBy', label: 'Awarded By', type: 'text' },
              { name: 'description', label: 'Description', type: 'text' },
              { name: 'awardDate', label: 'Award Date', type: 'date',required:true },
              // { name: 'status', label: 'Status', type: 'radio' },
              { name: 'createdById', label: 'Created By', type: 'number',hide:true  },
              { name: 'createdOn', label: 'Created On', type: 'date',hide:true },
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
              { name: 'accountTitle', label: 'Account Title', type: 'text',required:true },
              { name: 'accountNo', label: 'Account Number', type: 'text',required:true },
              { name: 'bankId', label: 'Bank Name', type: 'select' ,required:true},
              { name: 'branchName', label: 'Branch Name', type: 'text' },
              { name: 'branchCode', label: 'Branch Code', type: 'text' },
              { name: 'iban', label: 'IBAN', type: 'text' },
              // { name: 'status', label: 'Status', type: 'radio' },
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
              { name: 'countryId', label: 'Country', type: 'select' ,required:true},
              {
                name: 'eduIntId',
                label: 'Education Institute',
                type: 'select',required:true
              },
              { name: 'degId', label: 'Degree', type: 'select' ,required:true},
              { name: 'fsid', label: 'Field of Study', type: 'select',required:true },
              { name: 'startDate', label: 'Start Date', type: 'date' ,required:true},
              { name: 'endDate', label: 'End Date', type: 'date'  ,required:true},
              { name: 'issueDate', label: 'Issue Date', type: 'date' ,required:true },
              { name: 'gradingId', label: 'Grading', type: 'select' },
              { name: 'totalMarks', label: 'Total Marks', type: 'number' },
              { name: 'obtainMarks', label: 'Obtain Marks', type: 'number' },
              // { name: 'status', label: 'Status', type: 'radio' },
              {
                name: 'certificatePath',
                label: 'Certificate Path',
                type: 'file',
              },
              // { name: 'isCurrent', label: 'Is Current', type: 'text' },
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
              { name: 'did', label: 'Employee Department', type: 'select'  ,required:true},
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
              { name: 'did', label: 'Department', type: 'select'  ,required:true},
             
              { name: 'subDid', label: 'Sub Department', type: 'select' ,required:true },
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
            
              // { name: 'empId', label: 'Employee ID', type: 'text' },
              { name: 'desgnId', label: 'Employee Designation', type: 'select' ,required:true },
              // { name: 'createdById', label: 'Created By', type: 'text' },
              // { name: 'createdOn', label: 'Created On', type: 'text' },
              // { name: 'modifiedById', label: 'Modified By', type: 'text' },
              // { name: 'modifiedOn', label: 'Modified On', type: 'text' },
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
           
              { name: 'title', label: 'Job Title', type: 'text'  ,required:true},
              { name: 'company', label: 'Company Name', type: 'text'  ,required:true},
              { name: 'description', label: 'Description', type: 'text' },
              { name: 'fromDate', label: 'From Date', type: 'date'  ,required:true},
              { name: 'toDate', label: 'To Date', type: 'date'  ,required:true},
              {
                name: 'certificatePath',
                label: 'Certificate Path',
                type: 'file',
              },
              // { name: 'status', label: 'Status', type: 'radio' },
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
                name: 'facilityId',
                label: 'Employee Facility',
                type: 'select' ,required:true
              },
              // { name: 'empId', label: 'Employee ID', type: 'text' },
              // { name: 'facilityId', label: 'Facility ID', type: 'text' },
              // { name: 'createdById', label: 'Created By', type: 'text' },
              // { name: 'createdOn', label: 'Created On', type: 'text' },
              // { name: 'modifiedById', label: 'Modified By', type: 'text' },
              // { name: 'modifiedOn', label: 'Modified On', type: 'text' },
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
                name: 'spId',
                label: 'Employee Speciality',
                type: 'select' ,required:true
              },
              // { name: 'empId', label: 'Employee ID', type: 'text' },
              // { name: 'spId', label: 'Speciality ID', type: 'text' },
              // { name: 'status', label: 'Status', type: 'text' },
              // { name: 'createdById', label: 'Created By', type: 'text' },
              // { name: 'createdOn', label: 'Created On', type: 'text' },
              // { name: 'modifiedById', label: 'Modified By', type: 'text' },
              // { name: 'modifiedOn', label: 'Modified On', type: 'text' },
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
                name: 'subSpId',
                label: 'Employee Subspeciality',
                type: 'select' ,required:true
              },
              // { name: 'empId', label: 'Employee ID', type: 'text' },
              // { name: 'subSpId', label: 'Subspeciality ID', type: 'text' },
              // { name: 'status', label: 'Status', type: 'text' },
              // { name: 'createdById', label: 'Created By', type: 'text' },
              // { name: 'createdOn', label: 'Created On', type: 'text' },
              // { name: 'modifiedById', label: 'Modified By', type: 'text' },
              // { name: 'modifiedOn', label: 'Modified On', type: 'text' },
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

  ngOnDestroy() {
    console.log('Clearing Subscriptions ');
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = []; // Clear the array after unsubscribing
  }
}
