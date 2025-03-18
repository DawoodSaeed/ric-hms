import { Component, inject, signal } from '@angular/core';
import { DoctormanagementService } from '../../../services/doctormanagement.service';
import { AuthService } from '../../../services/auth.service';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { BehaviorSubject, Observable, switchMap, take, tap } from 'rxjs';
import { Doctor, EmployeeDropdown } from '../../../interfaces/doctormanagement';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { TypeTableService } from '../../../services/type-table.service';
import { Designation, EducationDegree } from '../../../interfaces/typetable';

@Component({
  selector: 'app-doctors',
  imports: [
    BreadcrumbComponent,
    TableModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    MessageModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    FileUploadModule,
    CheckboxModule,
    SelectModule,
    FormsModule,
  ],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss',
})
export class DoctorsComponent {
  private doctorService = inject(DoctormanagementService);
  private typeTableService = inject(TypeTableService);
  private notify = inject(NotificationService);
  private fb = inject(FormBuilder);

  doctors$!: Observable<Doctor[]>;

  employeesDropdown: EmployeeDropdown[] = [];
  designationDropdown: Designation[] = [];
  educationDegrees: EducationDegree[] = [];
  isLoading = signal(true);
  doctorForm!: FormGroup;
  displayDialog = signal(false);
  refreshDoctors$ = new BehaviorSubject<boolean>(false);

  electronicSignatureFile: File | null = null;
  pmccertificateFile: File | null = null;

  constructor() {}

  ngOnInit() {
    this.doctors$ = this.refreshDoctors$.pipe(
      switchMap(() =>
        this.doctorService
          .getDoctors()
          .pipe(tap(() => this.isLoading.set(false)))
      )
    );

    this.doctorService
      .employeeDropdown()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.employeesDropdown = data;
        },

        error: (error) => {
          this.notify.showError("Couldn't fetch the employees");
        },
      });

    this.typeTableService
      .getDesignations()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.designationDropdown = data;
        },

        error: (error) => {
          this.notify.showError("Couldn't fetch the designations");
        },
      });
    this.typeTableService
      .getEducationDegrees()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.educationDegrees = data;
        },

        error: (error) => {
          this.notify.showError("Couldn't fetch the education degrees");
        },
      });

    this.doctorForm = this.fb.group({
      empId: ['', Validators.required],
      pmcnumber: ['', [Validators.required]],
      pmccertificate: [null, Validators.required],
      electronicSignature: ['', Validators.required],
      displayDesignation: ['', Validators.required],
      displayQualification: ['', Validators.required],
      consultationFee: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      followUpFee: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      status: ['', Validators.required],
    });
  }

  clear(table: Table) {
    table.clear();
  }

  submitForm() {
    if (this.doctorForm.invalid) {
      let errorMessages = '';
      Object.keys(this.doctorForm.controls).forEach((key) => {
        if (this.doctorForm.get(key)?.invalid) {
          errorMessages += `${key} is required. `;
        }
      });
      this.notify.showError(
        `Please fill all the required fields. ${errorMessages}`
      );
      return;
    }

    console.log(this.doctorForm.value);
  }

  onFileSelect(event: any, field: string) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.doctorForm.get(field)?.setValue(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  refreshDoctors() {
    this.refreshDoctors$.next(!this.refreshDoctors$.value);
  }

  onSubmit() {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      let errorMessages = '';
      Object.keys(this.doctorForm.controls).forEach((key) => {
        if (this.doctorForm.get(key)?.invalid) {
          errorMessages += `${key} is required. `;
        }
      });
      this.notify.showError(
        `Please fill all the required fields. ${errorMessages}`
      );
      return;
    }

    console.log('status: ', this.doctorForm.get('status')?.value);
    const formData: Doctor = {
      ...this.doctorForm.value,
      docId: 0,
      status: this.doctorForm.get('status')?.value ? 1 : 0,
    };

    // Convert PMC Certificate and Electronic Signature to base64
    if (formData.pmccertificate) {
      formData.pmccertificate = formData.pmccertificate.split(',')[1]; // Remove data URL prefix
    }
    if (formData.electronicSignature) {
      formData.electronicSignature = formData.electronicSignature.split(',')[1]; // Remove data URL prefix
    }

    console.log(formData);

    // // Submit the form data to the API
    // this.doctorService.addDoctor(formData).subscribe({
    //   next: (response) => {
    //     console.log('Doctor added successfully:', response);
    //     this.displayDialog.set(false);
    //   },
    //   error: (error) => {
    //     console.error('Error adding doctor:', error);
    //   },
    // });

    this.doctorService.registerDoctor(formData).subscribe({
      next: (response) => {
        this.notify.showSuccess('Doctor added successfully');
        this.refreshDoctors();
        this.doctorForm.reset();
        this.displayDialog.set(false);
      },
      error: (error) => {
        this.notify.showError('Error adding doctor:');
      },
    });
  }

  edit(rowData: Doctor) {
    console.log(rowData);

    // Populate the form with rowData
    this.doctorForm.patchValue({
      empId: rowData.empId,
      pmcnumber: rowData.pmcnumber,
      pmccertificate: rowData.pmccertificate, // Base64 string
      electronicSignature: rowData.electronicSignature, // Base64 string
      displayDesignation: rowData.displayDesignation,
      displayQualification: rowData.displayQualification,
      consultationFee: rowData.consultationFee,
      followUpFee: rowData.followUpFee,
      status: rowData.status ? true : false,
    });

    // Open the dialog for editing
    this.displayDialog.set(true);
  }

  // Helper function to convert a File object to base64
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
