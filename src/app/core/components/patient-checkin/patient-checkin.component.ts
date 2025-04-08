import { DepartmentCategory, DiscountType, PaymentMethod } from './../../interfaces/typetable';


import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Checkbox } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TypeTableService } from '../../services/type-table.service';
import { OrganisationService } from '../../services/organisation.service';
import { debounceTime, map, Observable, tap } from 'rxjs';
import { Select } from 'primeng/select';
import { Department, SubDepartment } from '../../interfaces/organisation';
import { DoctormanagementService } from '../../services/doctormanagement.service';
import { Doctor } from '../../interfaces/doctormanagement';
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
    Select,
  ],
  providers: [BrowserModule],
})
export class PatientCheckinComponent implements OnInit {
  checkinForm!: FormGroup;

  private dropDownService = inject(TypeTableService);
  private orgDropDownService = inject(OrganisationService);
  private docDropDownService = inject(DoctormanagementService);
  discountTypesDropDown$!: Observable<any[]>;
  paymentMethodsDropDown$!: Observable<any[]>;
  deptDropDown$!: Observable<any[]>;
  subDeptDropDown$!: Observable<any[]>;
  doctorsDropDown$!: Observable<any[]>;

  commonFields: any[] = [
    { name: 'amount', label: 'Amount', type: 'number' },
    { name: 'paidAmount', label: 'Paid Amount', type: 'number' },
    { name: 'isDiscount', label: 'Is Discount', type: 'checkbox' },
    {
      name: 'discountTypeId',
      label: 'Discount Type',
      type: 'dropdown',
    },
    { name: 'discountRate', label: 'Discount Rate', type: 'number' },
    {
      name: 'paymentMethodId',
      label: 'Payment Method',
      type: 'dropdown',
    },
    { name: 'bookingRemarks', label: 'Booking Remarks', type: 'textarea' },
    { name: 'patientCondition', label: 'Patient Condition', type: 'textarea' },
    { name: 'reason', label: 'Reason', type: 'textarea' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.fetchDropdowns();
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
  fetchDropdowns() {
    this.discountTypesDropDown$ = this.dropDownService.getDiscountTypes().pipe(
      map((response: DiscountType[]) =>
        response.map((res) => ({
          label: res.name,
          value: res.id,
        }))
      )
    );
    let discountField = this.commonFields.find(
      (f) => f.name === 'discountTypeId'
    );
    // Got the reference of object
    console.log('found ', discountField);
    if (discountField) {
      discountField.options$ = this.discountTypesDropDown$;
    }
    // --
    this.paymentMethodsDropDown$ = this.dropDownService
      .getPaymentMethods()
      .pipe(
        map((response: PaymentMethod[]) =>
          response.map((res) => ({
            label: res.name,
            value: res.id,
          }))
        )
      );
    let paymentField = this.commonFields.find(
      (f) => f.name === 'paymentMethodId'
    );
    // Got the reference of object
    console.log('foundp ', paymentField);
    if (paymentField) {
      paymentField.options$ = this.paymentMethodsDropDown$;
    }
    // ----
    this.deptDropDown$ = this.orgDropDownService.getAllDepartments().pipe(
      tap((deptcats) => console.log('deptcats ', deptcats)),
      map((response: Department[]) =>
        response.map((res) => ({
          label: res.name,
          value: res.did,
        }))
      )
    );
    // Subdept
    this.subDeptDropDown$ = this.orgDropDownService.getAllSubDepartments().pipe(
      map((response: SubDepartment[]) =>
        response.map((res) => ({
          label: res.name,
          value: res.subDid,
        }))
      )
    );
  ;
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

        // All Doctors for doctor dropdown
        this.doctorsDropDown$ = this.docDropDownService.getDoctors().pipe(
          tap((docs) => console.log(docs)),
          map((response: Doctor[]) =>
            response.map((res) => ({
              label: res.employeeName,
              value: res.docId,
            }))
          )
        );
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
        // All Doctors for doctor dropdown
        this.doctorsDropDown$ = this.docDropDownService.getDoctors().pipe(
          tap((docs) => console.log(docs)),
          map((response: Doctor[]) =>
            response.map((res) => ({
              label: res.employeeName,
              value: res.docId,
            }))
          )
        );
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
  onValueChange(event: any, fieldName: string) {
    if (fieldName === 'department') {
      this.orgDropDownService.setDepartmentID(event.value);
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
