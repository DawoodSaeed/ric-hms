import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-patient-registration',
  templateUrl: './patient-registration.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    InputTextModule,
    DropdownModule,
    InputMaskModule,
    CalendarModule,
    ButtonModule,
  ],
})
export class PatientRegistrationComponent implements OnInit {
  form!: FormGroup;
  patientType: string = 'Regular';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group({
      // Common Fields
      patientId: [0],
      mrno: [''],
      name: [''],
      gender: [''],
      maritalStatus: [''],
      cnic: [''],
      passport: [''],
      dob: [null],
      religionId: [0],
      countryId: [0],
      provinceId: [0],
      cityId: [0],
      address: [''],
      mobileNo: [''],
      phone: [''],
      email: [''],
      guadianTypeId: [0],
      guadianName: [''],
      guadianNic: [''],
      noktypeId: [0],
      nokrelationId: [0],
      nokname: [''],
      noknic: [''],
      nokmobile: [''],
      patientTypeId: [0],
      porgId: [0],
      packId: [0],

      // Additional Fields (Entitle & Panel)
      pnlEmpCardNo: [''],
      pnlEmpCardExpiry: [null],
      pnlDepartment: [''],
      designation: [''],
      pnlDocument1: [''],
      pnlDocument2: [''],
      isSelf: [true],
      dependentNic: [''],
      dependentRelationId: [0],
      dependentDocument1: [''],
      dependentDocument2: [''],
    });
  }

  onTypeChange(type: string) {
    this.patientType = type;
  }

  submit() {
    let payload = { ...this.form.value };

    // Remove additional fields if patient is Regular
    if (this.patientType === 'Regular') {
      delete payload.pnlEmpCardNo;
      delete payload.pnlEmpCardExpiry;
      delete payload.pnlDepartment;
      delete payload.designation;
      delete payload.pnlDocument1;
      delete payload.pnlDocument2;
      delete payload.isSelf;
      delete payload.dependentNic;
      delete payload.dependentRelationId;
      delete payload.dependentDocument1;
      delete payload.dependentDocument2;
    }

    console.log('Submit Payload:', payload);
    // Submit to API
  }
}