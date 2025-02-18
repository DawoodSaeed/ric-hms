import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormStructure } from '../../core/interfaces/dynamicforminterface';
import { DynamicFormService } from '../../core/services/dynamic-form.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabsModule } from 'primeng/tabs';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
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
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent implements OnInit {
  @Input() formStructure!: FormStructure;
  form!: FormGroup;

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnInit(): void {
    console.log('Form Structure:', this.formStructure);
    this.form = this.dynamicFormService.createForm(this.formStructure);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
    } else {
      console.log('Form is invalid');
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
