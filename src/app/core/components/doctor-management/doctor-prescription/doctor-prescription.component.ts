import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Textarea, TextareaModule } from 'primeng/textarea';
import { TypeTableService } from '../../../services/type-table.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { distinctUntilChanged, Observable, of, startWith } from 'rxjs';
import { Complaint } from '../../../interfaces/typetable';
import { Button, ButtonModule } from 'primeng/button';

interface Medicine {
  name: string;
  frequency: string;
  dosage: string;
  duration: string;
  route: string;
  when: string;
}

interface ComplaintsDiagnosis {
  complaints: string;
  primaryDiagnosis: string;
  secondaryDiagnosis: string;
}

@Component({
  selector: 'app-doctor-prescription',
  templateUrl: './doctor-prescription.component.html',
  styleUrls: ['./doctor-prescription.component.scss'],
  imports: [
    DropdownModule,
    InputTextModule,
    CommonModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    TagModule,
    AvatarModule,
    TextareaModule,
    Textarea,
    MultiSelectModule,
    ButtonModule,
  ],
})
export class DoctorPrescriptionComponent implements OnInit {
  sidebarItems: MenuItem[] = [];
  activeMenuItem: string = 'allergy'; // Default active item

  private typeTableService = inject(TypeTableService);
  allergyTypes: any[] = [
    { label: 'Drug Allergy', value: 'drug' },
    { label: 'Food Allergy', value: 'food' },
  ];
  selectedAllergyType: any;
  drugAllergies: any[] = [
    { label: 'Penicillin', value: 'penicillin' },
    { label: 'Aspirin', value: 'aspirin' },
  ];
  selectedDrugAllergy: any;
  allergies: any[] = [
    { label: 'Dust', value: 'dust' },
    { label: 'Pollen', value: 'pollen' },
  ];
  selectedAllergy: any;
  allergyNotes: string = '';
  severities: any[] = [
    { label: 'Very Mild', value: 'veryMild' },
    { label: 'Mild', value: 'mild' },
  ];
  selectedSeverity: any;
  statuses: any[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];
  selectedStatus: any;

  medicines: Medicine[] = [
    {
      name: 'Tab Lexin (Paracetamol) 500mg - 150607',
      frequency: 'OD',
      dosage: '1',
      duration: '1 ds',
      route: 'mouth',
      when: 'prn',
    },
    {
      name: 'Tab Lasix (Furosemide + Amiloride HCL) 40mg/5mg - 150002',
      frequency: 'BD',
      dosage: '1',
      duration: '1 ds',
      route: 'mouth',
      when: 'prn',
    },
  ];

  medicinesSmall: Medicine[] = [
    {
      name: 'Tab Lexin...',
      frequency: 'OD',
      dosage: '1',
      duration: '1 ds',
      route: 'mouth',
      when: 'prn',
    },
    {
      name: 'Tab Lasix...',
      frequency: 'BD',
      dosage: '1',
      duration: '1 ds',
      route: 'mouth',
      when: 'prn',
    },
  ];

  complaintsDiagnosis: ComplaintsDiagnosis[] = [
    {
      complaints:
        'Chest Pain Typical (Best Breathe all the time, 2 years, 4 months, 1 weeks, 5 days)',
      primaryDiagnosis: 'Mark Up Of Chest Pain(aaaaaaa)',
      secondaryDiagnosis: '(BBBBBBBBBBBB)',
    },
  ];

  selectedComplaints$: Observable<Complaint[]> = of([]);
  complaints$!: Observable<Complaint[]>;

  complaintForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.sidebarItems = [
      {
        label: 'Template',
        icon: 'pi pi-fw pi-file',
        command: () => (this.activeMenuItem = 'template'),
      },
      {
        label: 'Chief Complaints',
        icon: 'pi pi-fw pi-exclamation-triangle',
        command: () => (this.activeMenuItem = 'chiefComplaints'),
      },
      {
        label: 'Exam Findings',
        icon: 'pi pi-fw pi-search',
        command: () => (this.activeMenuItem = 'examFindings'),
      },
      {
        label: 'History',
        icon: 'pi pi-fw pi-history',
        command: () => (this.activeMenuItem = 'history'),
      },
      {
        label: 'Risk Factors',
        icon: 'pi pi-fw pi-flag',
        command: () => (this.activeMenuItem = 'riskFactors'),
      },
      {
        label: 'Primary Diagnosis',
        icon: 'pi pi-fw pi-tag',
        command: () => (this.activeMenuItem = 'primaryDiagnosis'),
      },
      {
        label: 'Dispositions',
        icon: 'pi pi-fw pi-sign-out',
        command: () => (this.activeMenuItem = 'dispositions'),
      },
      {
        label: 'Investigations',
        icon: 'pi pi-fw pi-flask',
        command: () => (this.activeMenuItem = 'investigations'),
      },
      {
        label: 'Diagnostics',
        icon: 'pi pi-fw pi-heart',
        command: () => (this.activeMenuItem = 'diagnostics'),
      },
      {
        label: 'Procedures',
        icon: 'pi pi-fw pi-wrench',
        command: () => (this.activeMenuItem = 'procedures'),
      },
      {
        label: 'Medicines',
        icon: 'pi pi-fw pi- таблетка',
        command: () => (this.activeMenuItem = 'medicines'),
      },
      {
        label: 'Follow Up',
        icon: 'pi pi-fw pi-calendar-plus',
        command: () => (this.activeMenuItem = 'followUp'),
      },
      {
        label: 'Allergy',
        icon: 'pi pi-fw pi-info-circle',
        command: () => (this.activeMenuItem = 'allergy'),
      },
    ];

    this.complaints$ = this.typeTableService.getComplaints();

    this.complaintForm = this.formBuilder.group({
      complaint: [[], Validators.required], // Initialize with empty array
    });

    this.selectedComplaints$ = this.complaintForm
      .get('complaint')!
      .valueChanges.pipe(startWith([] as Complaint[]), distinctUntilChanged());
  }

  onAddIconClick(complaint: Complaint, event: Event) {
    console.log(complaint);
    event.preventDefault();
    event.stopPropagation();
  }
}
