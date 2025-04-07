import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TypeTableService } from '../../services/type-table.service';
import { City, DiscountType, dropDown, Religion } from '../../interfaces/typetable';
import {
  catchError,
  debounce,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { PatientService } from '../../services/patient.service';
import { NotificationService } from '../../services/notification.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputMask } from 'primeng/inputmask';
import { OrganisationService } from '../../services/organisation.service';
import { Panel } from 'primeng/panel';
import { PanelOrg, PanelPackage } from '../../interfaces/organisation';

@Component({
  selector: 'app-patient-registration',
  templateUrl: './patient-registration.component.html',
  imports: [
    InputMask,
    ConfirmDialog,
    ProgressSpinner,
    FileUploadModule,
    Select,
    DatePicker,
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
  providers: [ConfirmationService],
})
export class PatientRegistrationComponent implements OnInit {
  patientForm!: FormGroup;
  patientType: string = 'Regular';
  selectedPatientTypeId: number = 1;
  religionDropDown$!: Observable<any[]>;
  countryDropDown$!: Observable<any[]>;
  provinceDropDown$!: Observable<any[]>;
  cityDropDown$!: Observable<any[]>;
  guardianDropDown$!: Observable<any[]>;
  relationDropDown$!: Observable<any[]>;
  patientTypeDropDown$!: Observable<any[]>;
  departmentDropDown$!: Observable<any[]>;
  designationDropDown$!: Observable<any[]>;
  panelOrgDropDown$!: Observable<any[]>;
  panelPkgDropDown$!: Observable<any[]>;
  isLoading = signal(false);
  dropDownService = inject(TypeTableService);
  patientService = inject(PatientService);
  organizationService = inject(OrganisationService);
  
  constructor(
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchDropdowns();
  }
  fetchDropdowns() {
    this.religionDropDown$ = this.dropDownService.getReligions().pipe(
      map((religions) =>
        religions.map((religion) => ({
          label: religion.name,
          value: religion.id,
        }))
      )
    );
    this.provinceDropDown$ = this.dropDownService
      .getProvincesCountryWise()
      .pipe(
        tap((provinces) => console.log('provinces ', provinces)),
        map((provinces) =>
          provinces.map((provinces) => ({
            label: provinces.name,
            value: provinces.id,
          }))
        )
      );

    this.cityDropDown$ = this.dropDownService.getCitiesByProvinces().pipe(
      tap((cities) => console.log('cities ', cities)),
      map((cities: City[]) => {
        return cities.map((city: City) => {
          return {
            label: city.name,
            value: city.id,
          };
        });
      })
    );
    // this.cityDropDown$=this.dropDownService.getcit
    this.countryDropDown$ = this.dropDownService.getCountries().pipe(
      tap((contries) => console.log(contries)),
      map((countries) =>
        countries.map((countries) => ({
          label: countries.name,
          value: countries.id,
        }))
      )
    );
    this.guardianDropDown$ = this.dropDownService.getGuardianTypes().pipe(
      tap((guardiantypes) => console.log(guardiantypes)),
      map((guardiantypes) =>
        guardiantypes.map((guardiantypes) => ({
          label: guardiantypes.name,
          value: guardiantypes.id,
        }))
      )
    );
    this.relationDropDown$ = this.dropDownService.getRelations().pipe(
      tap((relations) => console.log(relations)),
      map((relations) =>
        relations.map((relations) => ({
          label: relations.name,
          value: relations.id,
        }))
      )
    );
    this.patientTypeDropDown$ = this.dropDownService.getPatientTypes();
    this.departmentDropDown$ = this.dropDownService
      .getDepartmentCategories()
      .pipe(
        tap((departments) => console.log(departments)),
        map((departments) =>
          departments.map((departments) => ({
            label: departments.name,
            value: departments.id,
          }))
        )
      );
    this.designationDropDown$ = this.dropDownService.getDesignations().pipe(
      tap((designations) => console.log(designations)),
      map((designations) =>
        designations.map((designations) => ({
          label: designations.name,
          value: designations.id,
        }))
      )
    );
    this.panelOrgDropDown$ = this.patientService.getPanelOrg().pipe(
      tap((orgs) => console.log('orgssx', orgs)),
      map((panelorgs: PanelOrg[]) =>
        panelorgs.map((orgs) => ({
          label: orgs.name,
          value: orgs.porgId,
        }))
      )
    );
    this.panelPkgDropDown$ = this.patientService.getPkgsOrgWise().pipe(
      tap((orgs) => console.log('orgssx', orgs)),
      map((panelorgs: PanelPackage[]) =>
        panelorgs.map((orgs) => ({
          label: orgs.name,
          value: orgs.ppid,
        }))
      )
    );



  }

  initializeForm() {
    this.patientForm = this.fb.group({
      // Common Fields
      patientId: [0],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      cnic: ['', Validators.required],
      passport: [''],
      dob: [null, Validators.required],
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
      picture: [''],
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

    this.patientForm
      .get('cnic')
      ?.valueChanges.pipe(
        tap((cnic) => console.log(cnic)),
        debounceTime(1000),
        distinctUntilChanged(),
        filter((cnic) => cnic.length === 15),
        switchMap((cnic) =>
          this.patientService.getPatientByCnic(cnic).pipe(
            // catcherror to gracefully handle not found
            catchError((err) => {
              return of(null);
            })
          )
        )
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.confirmationService.confirm({
              header: 'Patient Already Registered!',
              icon: 'pi pi-user-check',
              message:
                'This CNIC is already registered. Do you want to load the patient details?',
              acceptLabel: 'Yes, Load It',
              rejectLabel: 'No, Continue New',
              acceptButtonStyleClass: 'p-button-success',
              rejectButtonStyleClass: 'p-button-secondary',
              accept: () => {
                this.patientForm.patchValue(response);
              },
            });
          }
        },
      });
  }

  onTypeChange(type: string) {
    this.patientType = type;
  }
  onValueChange(event: any, fieldName: string) {
    console.log(event.value);
    if (fieldName === 'country') {
      this.dropDownService.setCountryID(event.value);
    }
    if (fieldName === 'province') {
      this.dropDownService.setProvinceID(event.value);
    }
    if (fieldName === 'panelOrg') {
      this.patientService.setPanelOrgId(event.value);
    }
  }
  uploadFile(event: any, controlName: string) {
    const file: File = event.files[0];
    if (file) {
      this.convertFileToBase64(file).then((base64: string) => {
        const base64Only = this.stripBase64Prefix(base64);
        console.log(`Base64 for ${controlName}:`, base64Only);
        this.patientForm.get(controlName)?.setValue(base64Only);
      });
    }
  }
  // checkCNIC(event:any){
  //   console.log(event.target.value)
  //   let cnic=event.target.value
  //    this.patientService
  //      .getPatientByCnic(cnic)
  //      .subscribe((response) => console.log('cnic response ', response));
  // };

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  stripBase64Prefix(base64String: string): string {
    // Removes everything before and including the comma
    return base64String.split(',')[1];
  }

  formatDateToYMD(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  submit() {
    this.isLoading.set(true);
    this.patientForm.markAllAsTouched();

    if (this.patientForm.valid) {
      let patientName = this.patientForm.get('name')?.value;
      let patientType = this.patientType;
      let cnic = this.patientForm.get('cnic')?.value;
      let mrNo = '123456789876543'; //this will come from backend

      if (this.patientForm.value.pnlEmpCardExpiry) {
        this.patientForm.value.pnlEmpCardExpiry = this.formatDateToYMD(
          this.patientForm.value.pnlEmpCardExpiry
        );
      }
      let payload = {
        ...this.patientForm.value,
        patientTypeId: this.selectedPatientTypeId,
        dob: this.formatDateToYMD(this.patientForm.value.dob),
      };

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
      this.patientService.addPatient(payload).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response) {
            this.notificationService.showSuccess(
              'Patient registered successfully'
            );
            console.log('resss', response);
            this.patientService.generatePDF(
              `${patientName}(${patientType})`,
              mrNo,
              cnic
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
      // Submit to API
    } else {
      this.isLoading.set(false);

      this.notificationService.showError(
        'Please enter all the required fields'
      );
    }
  }
}
