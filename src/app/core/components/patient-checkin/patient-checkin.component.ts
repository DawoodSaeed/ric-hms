import {
  DepartmentCategory,
  DiscountType,
  PaymentMethod,
} from './../../interfaces/typetable';

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Checkbox } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TypeTableService } from '../../services/type-table.service';
import { OrganisationService } from '../../services/organisation.service';
import {
  catchError,
  debounceTime,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Select } from 'primeng/select';
import { Department, SubDepartment } from '../../interfaces/organisation';
import { DoctormanagementService } from '../../services/doctormanagement.service';
import { Doctor } from '../../interfaces/doctormanagement';
import { Router } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { PatientService } from '../../services/patient.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { NotificationService } from '../../services/notification.service';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-patient-checkin',
  templateUrl: './patient-checkin.component.html',
  styleUrls: ['./patient-checkin.component.css'],
  imports: [
    ConfirmDialog,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    TextareaModule,
    Checkbox,
    ButtonModule,
    Select,
    InputMaskModule,
        ProgressSpinner
  ],
  providers: [BrowserModule, ConfirmationService],
})
export class PatientCheckinComponent implements OnInit {
  checkinForm!: FormGroup;
  cnicForm!: FormGroup;
  patientService = inject(PatientService);

  refferedFromOutside: boolean = false;
  private dropDownService = inject(TypeTableService);
  private orgDropDownService = inject(OrganisationService);
  private docDropDownService = inject(DoctormanagementService);
  discountTypesDropDown$!: Observable<any[]>;
  paymentMethodsDropDown$!: Observable<any[]>;
  deptDropDown$!: Observable<any[]>;
  subDeptDropDown$!: Observable<any[]>;
  doctorsDropDown$!: Observable<any[]>;
  checkInTypes$!: Observable<any[]>;
  allowCheckin: boolean = false;
  isLoading=signal(false)
  selectedCheckInType: string = 'Emergency';
  patientName: string = '';
  commonFields: any[] = [
    { name: 'amount', label: 'Amount', type: 'number' },
    { name: 'paidAmount', label: 'Paid Amount', type: 'number' },
    { name: 'isDiscount', label: 'Discount', type: 'checkbox' },
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
  ) {}

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
    this.cnicForm = this.fb.group({
      cnic: [''],
    });
    this.cnicForm
      .get('cnic')
      ?.valueChanges.pipe(
        debounceTime(800),
        filter((cnic: string) => !!cnic && /^\d{5}-\d{7}-\d{1}$/.test(cnic)), // ✅ Only proceed if CNIC is complete and valid
        switchMap((cnic) =>
          this.patientService.getPatientByCnic(cnic).pipe(
            // catcherror to gracefully handle not found
            catchError((err) => {
              console.log('caught an eror ', err);
              this.confirmationService.confirm({
                header: 'Patient Not Found!',
                icon: 'pi pi-user-check',
                message: 'This patient is not registered.',
                acceptLabel: 'Register Patient',
                rejectLabel: 'Ok',
                acceptButtonStyleClass: 'p-button-success',
                rejectButtonStyleClass: 'p-button-secondary',
                accept: () => {
                  this.router.navigate([
                    'admin/patient-management/registration',
                  ]);
                },
              });
              return of(null);
            })
          )
        )
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.confirmationService.confirm({
              header: 'Patient is Registered!',
              icon: 'pi pi-user-check',
              message:
                'This CNIC is registered. Do you want to checkin the patient?',
              acceptLabel: 'Proceed to Checkin',
              rejectLabel: 'No',
              acceptButtonStyleClass: 'p-button-success',
              rejectButtonStyleClass: 'p-button-secondary',
              accept: () => {
                console.log('resss ', response);
                this.checkinForm.get('patientId')?.setValue(response.patientId);
                this.patientName = response.name;
                this.allowCheckin = true;
              },
            });
          }
        },
      });
    this.checkinForm = this.fb.group({
      patientId: [null],
      patientTypeId: [1, Validators.required], // Walkin / Referral
      checkInTypeID: [1, Validators.required], // Emergency / Department / Doctor
      amount: [null, Validators.required],
      paidAmount: [null, Validators.required],
      isDiscount: [false],
      discountTypeId: [null],
      discountRate: [null],
      paymentMethodId: [null],
      patientCheckInStatusId: [1],
      bookingRemarks: [''],
      patientCondition: [''],
      reason: [''],
    });




    const patientId = history.state.patientId;
    const patientName = history.state.patientName;
    console.log('got patientid ', patientId);
    if (patientId) {
      this.checkinForm?.get('patientId')?.setValue(patientId);
      this.patientName = patientName;
      this.allowCheckin = true;
    }
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
    this.checkInTypes$ = this.dropDownService.getCheckInTypes();
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
  onValueChange(event: any, fieldName: string, checkInStr: string = '') {
    if (fieldName === 'department') {
      this.orgDropDownService.setDepartmentID(event.value);
    }
    if (fieldName === 'checkintype') {
      this.selectedCheckInType = checkInStr;
          this.checkinForm.get('amount')?.reset();
          this.checkinForm.get('paidAmount')?.reset();
          this.checkinForm.get('isDiscount')?.reset();
          this.checkinForm.get('discountTypeId')?.reset();
          this.checkinForm.get('discountRate')?.reset();
          this.checkinForm.get('paymentMethodId')?.reset();
          this.checkinForm.get('bookingRemarks')?.reset();
          this.checkinForm.get('patientCondition')?.reset();
          this.checkinForm.get('reason')?.reset();

    }
  }
  // Submit function
  onSubmit() {
    if (this.checkinForm.valid) {
      console.log(this.checkinForm.value);
      this.isLoading.set(true)
      this.patientService.checkInPatient(this.checkinForm.value).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response) {

            this.notificationService.showSuccess(
              response.message
            );
          }
        },
        error: (err) => {
          this.notificationService.showError(err.error.message);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
    }else{

    }
  }
}
