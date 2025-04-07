// import { Component, inject, OnInit } from '@angular/core';
// import { TypeTableService } from '../../services/type-table.service';
// import { OrganisationService } from '../../services/organisation.service';
// @Component({
//   selector: 'app-patient-checkin',
//   imports: [],
//   templateUrl: './patient-checkin.component.html',
//   styleUrl: './patient-checkin.component.scss'
// })
// export class PatientCheckinComponent implements OnInit {
//   private dropDownService=inject(TypeTableService)
//   private orgDropDownService=inject(OrganisationService)
// ngOnInit(): void {
//   this.dropDownService.getCheckInTypes().subscribe((checinTypes:any)=>console.log('checkintypes ',checinTypes))
// // this.dropDownService.getPatientCheckInStatuses().subscribe(statuses=>console.log(statuses))
// this.orgDropDownService.getAllServices().subscribe(services=>console.log(services))
// this.dropDownService.getPatientTypes().subscribe(types=>console.log(types))
// }
// }

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // ✅ Import this
import { BrowserModule } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Checkbox } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-patient-checkin',
  templateUrl: './patient-checkin.component.html',
  styleUrls: ['./patient-checkin.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    TextareaModule,
    Checkbox,
    ButtonModule,
  ],
  providers: [BrowserModule],
})
export class PatientCheckinComponent implements OnInit {
  checkinForm!: FormGroup;
  commonFields = [
    { name: 'amount', label: 'Amount', type: 'number' },
    { name: 'paidAmount', label: 'Paid Amount', type: 'number' },
    { name: 'isDiscount', label: 'Is Discount', type: 'checkbox' },
    { name: 'discountTypeId', label: 'Discount Type', type: 'dropdown' },
    { name: 'discountRate', label: 'Discount Rate', type: 'number' },
    { name: 'paymentMethodId', label: 'Payment Method', type: 'number' },

    { name: 'bookingRemarks', label: 'Booking Remarks', type: 'textarea' },
    { name: 'patientCondition', label: 'Patient Condition', type: 'textarea' },
    { name: 'reason', label: 'Reason', type: 'textarea' },
  ];
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();

    // Handle form updates dynamically
    this.checkinForm.get('patientTypeId')?.valueChanges.subscribe(() => {
      this.updateFormFields();
    });

    this.checkinForm.get('checkInTypeID')?.valueChanges.subscribe(() => {
      this.updateFormFields();
    });
  }

  // Initialize the base form
  initForm() {
    this.checkinForm = this.fb.group({
      patientId: [0, Validators.required],
      patientTypeId: [1, Validators.required], // Walkin / Referral
      checkInTypeID: [1, Validators.required], // Emergency / Department / Doctor
      amount: [0, Validators.required],
      paidAmount: [0, Validators.required],
      isDiscount: [false],
      discountTypeId: [0],
      discountRate: [0],
      paymentMethodId: [0],
      patientCheckInStatusId: [0],
      bookingRemarks: [''],
      patientCondition: [''],
      reason: [''],
    });
  }

  // Function to update form fields dynamically
  updateFormFields() {
    const patientType = this.checkinForm.get('patientTypeId')?.value;
    const checkInType = this.checkinForm.get('checkInTypeID')?.value;

    // Remove unnecessary fields first
    this.removeFields([
      'doctorId',
      'deptId',
      'subDeptId',
      'isRefered',
      'isReferedFromOutSide',
      'outSideDocName',
      'referedNotes',
    ]);

    if (patientType === 1) {
      // Walkin
      // Hanlde emergency later if any fields come
      if (checkInType === 2) {
        // Department
        this.addFields({
          deptId: [0, Validators.required],
          subDeptId: [0, Validators.required],
        });
      } else if (checkInType === 3) {
        // Doctor
        this.addFields({
          doctorId: ['', Validators.required],
        });
      }
    } else if (patientType === 2) {
      // Referral
      this.addFields({
        isRefered: [true],
        isReferedFromOutSide: [false],
        outSideDocName: [''],
        referedNotes: [''],
      });

      if (checkInType === 2) {
        // Department
        this.addFields({
          deptId: [0, Validators.required],
          subDeptId: [0, Validators.required],
        });
      } else if (checkInType === 3) {
        // Doctor
        this.addFields({
          doctorId: ['', Validators.required],
        });
      }
    }
  }

  // Helper method to remove fields from the form
  removeFields(fields: string[]) {
    fields.forEach((field) => {
      if (this.checkinForm.contains(field)) {
        this.checkinForm.removeControl(field);
      }
    });
  }

  // Helper method to add fields dynamically
  addFields(fields: { [key: string]: any }) {
    for (let key in fields) {
      if (!this.checkinForm.contains(key)) {
        const fieldValue = fields[key][0]; // Default value
        const fieldValidators = fields[key][1] || []; // Validators (if any)
        this.checkinForm.addControl(
          key,
          this.fb.control(fieldValue, fieldValidators)
        );
      }
    }
  }

  // Submit function
  onSubmit() {
    if (this.checkinForm.valid) {
      console.log(this.checkinForm.value);
      // Send data to API
    }
  }
}
