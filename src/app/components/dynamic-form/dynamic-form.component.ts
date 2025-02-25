import { Component, computed, inject, Inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormGroup, FormsModule, FormControl } from '@angular/forms';
import { FormStructure } from '../../core/interfaces/dynamicforminterface';
import { DynamicFormService } from '../../core/services/dynamic-form.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabsModule } from 'primeng/tabs';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { EventEmitter } from '@angular/core';
import { RadioButton } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';
import { ProgressSpinner } from 'primeng/progressspinner';
import { NOTYF } from './../../shared/utils/notyf.token';
import { Notyf } from 'notyf';
import { EmployeeService } from '../../core/services/employee.service';
@Component({
  selector: 'app-dynamic-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TabsModule,
    Select,
    InputTextModule,
    CalendarModule,
    RadioButton,
    FileUploadModule,
    ProgressSpinner,
    DynamicTableComponent
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent implements OnInit {
 
  @Input() formStructure!: FormStructure;
  @Output() dataEmitter = new EventEmitter<any>();
  @Input() isLoading: boolean = false;
  entriesCount:number=2
  form!: FormGroup;
  uploadedImages: { [key: string]: string | ArrayBuffer } = {};
  selectedTabIndex: number = 0;
  currentTab = signal('');
  private emplyeeService=inject(EmployeeService)
  registeredEmpID=computed(()=>this.emplyeeService.registeredEmpIDSignal())

  constructor(private dynamicFormService: DynamicFormService,@Inject(NOTYF) private notyf: Notyf) {

  }

  ngOnInit(): void {
    console.log('Form Structure:', this.formStructure);
    this.form = this.dynamicFormService.createForm(this.formStructure);
    if (this.formStructure.tabs) {
      this.currentTab.set(this.formStructure.tabs[0].tabName);
    }
  }
  receivedData(data:any){
    console.log('data received ',data);
    if(this.form){
      Object.keys(data).forEach((key:any)=>{
        if(this.form.controls[key]){
          this.form.controls[key].setValue(data[key])
        }
      })
    }
    
  }
  onTabChange(event: any) {
    console.log('calling onTabChange');
    console.log('change event ', event);
    this.selectedTabIndex = event; // Update selected tab index
    if (this.formStructure.tabs) {
      this.currentTab.set(this.formStructure.tabs[this.selectedTabIndex].tabName);
    } 
  }
  onImageUpload(event: any, fieldName: string) {
    // PrimeNG file upload returns files in event.files array
    const file: File = event.files[0];

    if (file) {
      const reader = new FileReader();

      // On file load, convert to base64 string
      reader.onload = () => {
        const base64String = reader.result as string;

        // Store base64 in uploadedImages for preview
        this.uploadedImages[fieldName] = base64String;

        // Store base64 string in the form control
        this.form.get(fieldName)?.setValue(base64String);
      };

      // Read the file as a Data URL (base64)
      reader.readAsDataURL(file);
    }
  }

  onDateSelect(event: any, fieldName: string) {
    console.log(event);
    const date = new Date(event);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day

    const formattedDate = `${year}-${month}-${day}`;
    this.form.get(fieldName)?.setValue(formattedDate);
  }

  onSubmit(): void {

    if (this.form.valid && this.formStructure?.tabs) {
      // Ensure formStructure and tabs exist before accessing
      const selectedTab = this.formStructure.tabs[this.selectedTabIndex];
      if (!selectedTab) return; // Safety check
      // Extract only the form data from the selected tab
      const apiToCall = selectedTab.apiToCall;
      const tabData: any = {};
      selectedTab.sections.forEach((section) => {
        section.fields.forEach((field) => {
          tabData[field.name] = this.form.value[field.name];
        });
      });
      this.dataEmitter.emit({
        tabIndex: this.selectedTabIndex,
        apiToCall,
        data: tabData,
      }); // Emit selected tab data
    } else {
      console.log('Form is invalid or formStructure is not defined');
    }
  }
}

// How to pass data
// There are three ways to pass and show input fields
// Tabs Based
// 👉 Use when you want multiple tabs, with each tab containing sections of fields.
// const formStructureWithTabs = {
//   globalTitle: "Employee Details", // Always shown at the top of the form
//   tabs: [
//     {
//       tabName: "Basic Info",
//       sections: [
//         {
//           title: "Personal Information",
//           fields: [
//             { name: "firstName", label: "First Name", type: "text" },
//             { name: "lastName", label: "Last Name", type: "text" },
//             { name: "dob", label: "Date of Birth", type: "text" }
//           ]
//         },
//         {
//           title: "Contact Information",
//           fields: [
//             { name: "email", label: "Email", type: "text" },
//             { name: "phone", label: "Phone", type: "text" }
//           ]
//         }
//       ]
//     },
//     {
//       tabName: "Job Details",
//       sections: [
//         {
//           title: "Contract Information",
//           fields: [
//             {
//               name: "jobType",
//               label: "Job Type",
//               type: "select",
//               options: [
//                 { value: "full-time", label: "Full-Time" },
//                 { value: "part-time", label: "Part-Time" }
//               ]
//             },
//             { name: "ntnNumber", label: "NTN Number", type: "text" }
//           ]
//         }
//       ]
//     }
//   ]
// };

// Flat Form with Sections

// 👉 Use when you don’t want tabs, but you want sections with their own titles and fields.
// const formStructureWithSections = {
//   globalTitle: "Employee Details", // Always shown at the top of the form
//   sections: [
//     {
//       title: "Personal Information",
//       fields: [
//         { name: "firstName", label: "First Name", type: "text" },
//         { name: "lastName", label: "Last Name", type: "text" },
//         { name: "dob", label: "Date of Birth", type: "text" }
//       ]
//     },
//     {
//       title: "Contact Information",
//       fields: [
//         { name: "email", label: "Email", type: "text" },
//         { name: "phone", label: "Phone", type: "text" }
//       ]
//     },
//     {
//       title: "Job Information",
//       fields: [
//         {
//           name: "jobType",
//           label: "Job Type",
//           type: "select",
//           options: [
//             { value: "full-time", label: "Full-Time" },
//             { value: "part-time", label: "Part-Time" }
//           ]
//         },
//         { name: "ntnNumber", label: "NTN Number", type: "text" }
//       ]
//     }
//   ]
// };

// Simple Flat Form (No Tabs, No Sections)

// 👉 Use when you just want a single-level form without tabs or sections.
// const formStructureSimple = {
//   globalTitle: "Employee Details", // Always shown at the top of the form
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
//     { name: "ntnNumber", label: "NTN Number", type: "text" }
//   ]
// };
