import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DoctormanagementService } from '../../../services/doctormanagement.service';
import { ButtonModule } from 'primeng/button';
import {
  DoctorTemplate,
  DoctorTemplateComplaint,
  DoctorTemplateComplaintIds,
  DoctorTemplateDiagnosisIds,
  DoctorTemplateFollowUp,
  DoctorTemplateFollowUpIds,
  DoctorTemplateInstruction,
  DoctorTemplateInstructionIds,
} from '../../../interfaces/doctormanagement';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { SelectModule } from 'primeng/select';
import {
  BehaviorSubject,
  of,
  catchError,
  switchMap,
  tap,
  startWith,
  map,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { TypeTableService } from '../../../services/type-table.service';
import Keyboard from 'simple-keyboard';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea, TextareaModule } from 'primeng/textarea';
import urduLayout from 'simple-keyboard-layouts/build/layouts/urdu';
import {
  ComplaintData,
  DiagnosisData,
  FollowUp,
  FollowUpData,
  Instruction,
  InstructionData,
} from '../../../interfaces/typetable';
import { MultiSelectModule } from 'primeng/multiselect';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { atLeastOneValidator } from '../../../validators/atleastone';

@Component({
  selector: 'app-doctor-template',
  templateUrl: './doctor-template.component.html',
  styleUrls: ['./doctor-template.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    CommonModule,
    InputTextModule,
    TextareaModule,
    MultiSelectModule,
    BreadcrumbComponent,
  ],
})
export class DoctorTemplateComponent {
  private doctorManagementService = inject(DoctormanagementService);
  private typeTableService = inject(TypeTableService);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);

  doctorId!: number;
  form: FormGroup;
  templateNameForm: FormGroup;
  templateInstructionForm: FormGroup;
  followUpForm: FormGroup;
  complaintsForm: FormGroup;
  dignosisForm: FormGroup;

  // Display dialogs
  displayTemplateNameDialog = signal<boolean>(false);
  displayTemplateInstructionDialog = signal<boolean>(false);
  displayFollowUpDialog = signal<boolean>(false);
  displayComplaintsDialog = signal<boolean>(false);
  displayDignosisDialog = signal<boolean>(false);

  // Refresh subjects for all data streams
  private refreshTemplateNames$ = new BehaviorSubject<void>(undefined);
  private refreshTemplateInstructions$ = new BehaviorSubject<void>(undefined);
  private refreshFollowUps$ = new BehaviorSubject<void>(undefined);
  private refreshComplaints$ = new BehaviorSubject<void>(undefined);
  private refreshSpecialities$ = new BehaviorSubject<void>(undefined);
  private refreshDignosis$ = new BehaviorSubject<void>(undefined);
  // Loading states
  isLoadingTemplateNames = false;
  isLoadingTemplateInstructions = false;
  isLoadingFollowUps = false;
  isLoadingComplaints = false;
  isLoadingSpecialities = false;
  isLoadingDignosis = false;
  keyboard: Keyboard | null = null;
  keyboardVisible = false;
  // Reactive data streams
  templateNames$ = this.refreshTemplateNames$.pipe(
    tap(() => (this.isLoadingTemplateNames = true)),
    switchMap(() =>
      this.doctorManagementService.getDoctorTemplatesById().pipe(
        catchError(() => of([])),
        tap(() => (this.isLoadingTemplateNames = false)),
        startWith([]),

        map((result) => (Array.isArray(result) ? result : [result]))
      )
    ),
    catchError(() => of(undefined))
  );

  templateInstructions$ = this.refreshTemplateInstructions$.pipe(
    tap(() => (this.isLoadingTemplateInstructions = true)),
    switchMap(() =>
      this.typeTableService.getInstructions().pipe(
        catchError(() => of([])), // Emit an empty array on error
        tap(() => (this.isLoadingTemplateInstructions = false)),
        startWith([])
      )
    )
  );

  followUps$ = this.refreshFollowUps$.pipe(
    tap(() => (this.isLoadingFollowUps = true)),
    switchMap(() =>
      this.typeTableService.getFollowUps().pipe(
        catchError(() => of([])), // Emit an empty array on error
        tap(() => (this.isLoadingFollowUps = false)),
        startWith([])
      )
    )
  );

  complaints$ = this.refreshComplaints$.pipe(
    tap(() => (this.isLoadingComplaints = true)),
    switchMap(() =>
      this.typeTableService.getComplaints().pipe(
        catchError(() => of([])), // Emit an empty array on error
        tap(() => (this.isLoadingComplaints = false)),
        startWith([])
      )
    )
  );

  specialities$ = this.refreshSpecialities$.pipe(
    tap(() => (this.isLoadingSpecialities = true)),
    switchMap(() =>
      this.typeTableService.getSpeciality().pipe(
        catchError(() => of([])),
        tap(() => (this.isLoadingSpecialities = false)),
        startWith([])
      )
    )
  );

  dignosis$ = this.refreshDignosis$.pipe(
    tap(() => (this.isLoadingDignosis = true)),
    switchMap(() =>
      this.typeTableService.getDiagnosis().pipe(
        catchError(() => of([])),
        tap(() => (this.isLoadingDignosis = false)),
        startWith([])
      )
    )
  );

  constructor(private fb: FormBuilder) {
    // Initialize the form with disabled controls
    this.form = this.fb.group({
      templateName: ['', Validators.required], // Required field
      templateInstruction: [
        { value: [], disabled: true },
        [atLeastOneValidator],
      ], // At least one item must be selected
      followUp: [{ value: [], disabled: true }, [atLeastOneValidator]], // At least one item must be selected
      complaints: [{ value: [], disabled: true }, [atLeastOneValidator]], // At least one item must be selected
      diagnosis: [{ value: [], disabled: true }, [atLeastOneValidator]], // At least one item must be selected
    });

    // Initial load
    this.refreshAllData();

    this.templateNameForm = this.fb.group({
      newTemplateName: ['', Validators.required],
      newTemplateDescription: ['', Validators.required],
    });

    this.templateInstructionForm = this.fb.group({
      name: ['', Validators.required],
      urduName: [''],
      description: [''],
      specialities: [[], Validators.required],
    });

    this.followUpForm = this.fb.group({
      name: ['', Validators.required],
      urduName: [''],
      description: [''],
      specialities: [[], Validators.required],
    });

    this.complaintsForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      specialities: [[], Validators.required],
    });

    this.dignosisForm = this.fb.group({
      name: ['', Validators.required],
      code: [''],
      description: [''],
      specialities: [[], Validators.required],
    });

    this.authService.loggedInUserId$.subscribe({
      next: (res) => {
        this.doctorId = parseInt(res);
      },
      error: (err) => {
        this.notify.showError('Failed to fetch doctor ID');
      },
    });

    this.typeTableService.getSpeciality();
  }

  refreshAllData() {
    this.refreshTemplateNames$.next();
    this.refreshTemplateInstructions$.next();
    this.refreshFollowUps$.next();
    this.refreshComplaints$.next();
  }

  openTemplateNameDialog() {
    this.displayTemplateNameDialog.set(true);
  }

  openFollowUpDialog() {
    this.displayFollowUpDialog.set(true);
  }

  openComplaintsDialog() {
    this.displayComplaintsDialog.set(true);
  }

  openDignosisDialog() {
    this.displayDignosisDialog.set(true);
  }

  saveTemplateName() {
    if (this.templateNameForm.valid) {
      const template: DoctorTemplate = {
        tempId: 0,
        name: this.templateNameForm.value.newTemplateName,
        description: this.templateNameForm.value.newTemplateDescription,
        docId: this.doctorId,
        status: 1,
        createdById: this.doctorId,
        createdOn: new Date().toISOString(),
        modifiedById: this.doctorId,
        modifiedOn: new Date().toISOString(),
      };

      this.doctorManagementService
        .addOrUpdateDoctorTemplate(template)
        .subscribe({
          next: (res) => {
            this.notify.showSuccess('Template name added successfully');
            this.refreshAllData();
            this.templateNameForm.reset();
            this.displayTemplateNameDialog.set(false);
          },
          error: (err) => {
            this.notify.showError('Failed to add template name');
          },
        });
    }
  }

  saveTemplateInstruction() {
    this.templateInstructionForm.markAllAsTouched();

    if (this.templateInstructionForm.valid) {
      const instruction: InstructionData = {
        instruction: {
          instrId: 0,
          name: this.templateInstructionForm.value.name,
          urduName: this.templateInstructionForm.value.urduName,
          description: this.templateInstructionForm.value.description,
          status: 1,
          createdById: this.doctorId,
          createdOn: new Date().toISOString(),
          modifiedById: this.doctorId,
          modifiedOn: new Date().toISOString(),
          isActive: 1,
        },
        specialities: this.templateInstructionForm.value.specialities,
      };
      this.typeTableService.addUpdateInstruction(instruction).subscribe({
        next: (res) => {
          this.notify.showSuccess('Template instruction added successfully');
          this.refreshAllData();
          this.templateInstructionForm.reset();
          this.displayTemplateInstructionDialog.set(false);
          console.log(res);
        },
        error: (err) => {
          this.notify.showError('Failed to add template instruction');
        },
      });
    }
  }

  // Save Follow Up
  saveFollowUp() {
    if (this.followUpForm.valid) {
      const followUpData: FollowUpData = {
        followUp: {
          followId: 0,
          name: this.followUpForm.value.name,
          urduName: this.followUpForm.value.urduName,
          description: this.followUpForm.value.description,
          status: 0,
          createdById: this.doctorId,
          createdOn: new Date().toISOString(),
          modifiedById: this.doctorId,
          modifiedOn: new Date().toISOString(),
          isActive: 1,
        },
        specialities: this.followUpForm.value.specialities, // Array of specId values
      };

      this.typeTableService.addUpdateFollowUp(followUpData).subscribe({
        next: (res) => {
          this.notify.showSuccess('Follow Up saved successfully');
          this.refreshAllData();
          this.followUpForm.reset();
          this.displayFollowUpDialog.set(false);
        },
        error: (err) => {
          this.notify.showError('Failed to save Follow Up');
        },
      });
    }
  }

  // Save Complaint
  saveComplaints() {
    if (this.complaintsForm.valid) {
      const complaintData: ComplaintData = {
        complaint: {
          compId: 0, // Default for new entries
          name: this.complaintsForm.value.name,
          description: this.complaintsForm.value.description,
          status: 0, // Default status
          createdById: this.doctorId, // Current user ID
          createdOn: new Date().toISOString(), // Current timestamp
          modifiedById: this.doctorId, // Current user ID
          modifiedOn: new Date().toISOString(), // Current time stamp
          isActive: 1,
        },
        specialities: this.complaintsForm.value.specialities, // Array of specId values
      };

      this.typeTableService.addUpdateComplaint(complaintData).subscribe({
        next: (res) => {
          this.notify.showSuccess('Complaint saved successfully');
          this.refreshAllData(); // Refresh the data
          this.complaintsForm.reset(); // Reset the form
          this.displayComplaintsDialog.set(false); // Close the dialog
        },
        error: (err) => {
          this.notify.showError('Failed to save Complaint');
        },
      });
    }
  }

  onTemplateNameChange() {
    const templateNameSelected = !!this.form.get('templateName')?.value;

    // Enable/disable other dropdowns based on template name selection
    if (templateNameSelected) {
      this.form.get('templateInstruction')?.enable();
      this.form.get('followUp')?.enable();
      this.form.get('complaints')?.enable();
      this.form.get('diagnosis')?.enable();
    } else {
      this.form.get('templateInstruction')?.disable();
      this.form.get('followUp')?.disable();
      this.form.get('complaints')?.disable();
      this.form.get('diagnosis')?.disable();
    }
  }
  @ViewChild('keyboard') keyboardElement!: ElementRef;

  onChange(input: string) {
    const inputField = document.getElementById('urduName') as HTMLInputElement;
    if (inputField) {
      inputField.value = input;
    }
  }

  onKeyPress(button: string) {
    if (button === '{bksp}') {
      const inputField = document.getElementById(
        'urduName'
      ) as HTMLInputElement;
      if (inputField) {
        inputField.value = inputField.value.slice(0, -1);
        this.keyboard?.setInput(inputField.value);
      }
    }
  }

  showKeyboard() {
    this.keyboardVisible = true;
  }

  toggleUrduKeyboard() {
    this.keyboardVisible = !this.keyboardVisible;
  }

  openTemplateInstructionDialog() {
    this.displayTemplateInstructionDialog.set(true);
    setTimeout(() => {
      this.initializeKeyboard();
    }, 0); // Wait for the dialog to render
  }

  initializeKeyboard() {
    if (this.keyboardElement && !this.keyboard) {
      this.keyboard = new Keyboard(this.keyboardElement.nativeElement, {
        layout: urduLayout.layout,
        onChange: (input) => this.onChange(input),
        onKeyPress: (button) => this.onKeyPress(button),
      });
    }
  }

  onSubmit() {
    console.log(this.form.value);
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const hasTemplateInstruction =
        this.form.value.templateInstruction.length > 0;
      const hasFollowUp = this.form.value.followUp.length > 0;
      const hasComplaints = this.form.value.complaints.length > 0;
      const hasTemplateName = this.form.value.templateName.value !== '';
      const hasDignosis = this.form.value.diagnosis.length > 0;

      if (
        hasTemplateName &&
        (hasTemplateInstruction || hasFollowUp || hasComplaints || hasDignosis)
      ) {
        this.handleFormSubmission();
      } else {
        console.log('Form is invalid or missing required fields');
        this.notify.showError('Form is invalid or missing required fields');
      }
    } else {
      this.notify.showError('Form is invalid');
    }
  }

  saveDignosis() {
    if (this.dignosisForm.valid) {
      const dignosisData: DiagnosisData = {
        diagnosis: {
          digId: 0,
          name: this.dignosisForm.value.name,
          code: this.dignosisForm.value.code,
          description: this.dignosisForm.value.description,
          status: 0,
          createdById: this.doctorId,
          createdOn: new Date().toISOString(),
          modifiedById: this.doctorId,
          modifiedOn: new Date().toISOString(),
          isActive: 1,
          specialityId: this.dignosisForm.value.specialities[0],
        },
        specialities: this.dignosisForm.value.specialities,
      };

      this.typeTableService.addUpdateDiagnosis(dignosisData).subscribe({
        next: (res) => {
          this.notify.showSuccess('Dignosis saved successfully');
          this.refreshAllData();
          this.dignosisForm.reset();
          this.displayDignosisDialog.set(false);
        },
        error: (err) => {
          this.notify.showError('Failed to save Dignosis');
        },
      });
    }
  }

  handleFormSubmission() {
    console.log('Form is valid and has required fields filled');
    if (
      Array.isArray(this.form.get('templateInstruction')?.value) &&
      this.form.get('templateInstruction')?.value.length > 0
    ) {
      const templateInstruction: DoctorTemplateInstructionIds = {
        docTempId: this.form.get('templateName')?.value,
        instrIds: this.form.get('templateInstruction')?.value,
      };
      this.doctorManagementService
        .addOrUpdateDoctorTemplateInstruction(templateInstruction)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.notify.showSuccess('Template instruction saved successfully');
          },
          error: (err) => {
            this.notify.showError('Failed to save Template instruction');
          },
        });
    }
    if (
      Array.isArray(this.form.get('followUp')?.value) &&
      this.form.get('followUp')?.value.length > 0
    ) {
      const templateFollowUp: DoctorTemplateFollowUpIds = {
        docTempId: this.form.get('templateName')?.value,
        followUpIds: this.form.get('followUp')?.value,
      };
      this.doctorManagementService
        .addOrUpdateDoctorTemplateFollowUp(templateFollowUp)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.notify.showSuccess('Template follow up saved successfully');
          },
          error: (err) => {
            this.notify.showError('Failed to save Template follow up');
          },
        });
    }
    if (
      Array.isArray(this.form.get('complaints')?.value) &&
      this.form.get('complaints')?.value.length > 0
    ) {
      // Handle complaints
      const templateComplaint: DoctorTemplateComplaintIds = {
        docTempId: this.form.get('templateName')?.value,
        ComplaintIds: this.form.get('complaints')?.value,
      };
      this.doctorManagementService
        .addOrUpdateDoctorTemplateComplaint(templateComplaint)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.notify.showSuccess('Complaint saved successfully');
          },
          error: (err) => {
            this.notify.showError('Failed to save Complaint');
          },
        });
    }
    if (
      Array.isArray(this.form.get('diagnosis')?.value) &&
      this.form.get('diagnosis')?.value.length > 0
    ) {
      // Handle dignosis
      const templateDiagnosis: DoctorTemplateDiagnosisIds = {
        docTempId: this.form.get('templateName')?.value,
        diagnosisIds: this.form.get('diagnosis')?.value,
      };
      this.doctorManagementService
        .addOrUpdateDoctorTemplateDiagnosis(templateDiagnosis)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.notify.showSuccess('Dignosis saved successfully');
          },
          error: (err) => {
            this.notify.showError('Failed to save Dignosis');
          },
        });
    }
  }
}
