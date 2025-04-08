import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { PatientQueueService } from '../../../services/patient-queue.service';
import {
  PatientCheckInDetails,
  PatientQueueFilter,
  PatientVitals,
} from '../../../interfaces/patients-queue';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  defer,
  distinctUntilChanged,
  filter,
  finalize,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { WaitingTimePipe } from '../../../pipes/waiting-time/waiting-time.pipe';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-patient-queue',
  imports: [
    TabViewModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    BreadcrumbComponent,
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    WaitingTimePipe,
    DividerModule,
  ],
  templateUrl: './patient-queue.component.html',
  styleUrl: './patient-queue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientQueueComponent implements OnInit {
  patientQueue = inject(PatientQueueService);
  private notify = inject(NotificationService);
  activeTab = 0;

  patients$: Observable<PatientCheckInDetails[]>;
  tabChange$ = new BehaviorSubject<number>(1);
  isLoading = signal(true);

  displayVitalsDialog = signal(false);
  vitalsForm!: FormGroup;

  patientId$ = new BehaviorSubject<number>(-1);
  patientVitals$!: Observable<PatientVitals[]>;
  isVitalLoading = signal(true);
  refreshVitals$ = new BehaviorSubject<boolean>(false);
  selectedVital!: PatientVitals;
  constructor() {
    this.patients$ = this.tabChange$.pipe(
      throttleTime(500),

      distinctUntilChanged(),

      switchMap((tabIndex) => {
        this.isLoading.set(true);
        return this.patientQueue
          .getPatientQueue({
            DeptID: 4,
            PatientCheckInStatus: tabIndex,
          })
          .pipe(
            catchError(() => {
              this.notify.showError("Couldn't fetch the information.");
              return of([]);
            }),
            finalize(() => this.isLoading.set(false))
          );
      })
    );

    this.patientVitals$ = combineLatest([
      this.patientId$,
      this.refreshVitals$,
    ]).pipe(
      tap(() => this.isVitalLoading.set(true)),
      filter(([id, _]) => id !== -1),
      distinctUntilChanged(),
      switchMap(([id, _]) =>
        this.patientQueue.getPatientVitals(id).pipe(
          catchError(() => {
            this.notify.showError("Couldn't fetch the information.");
            return of([]);
          }),
          finalize(() => this.isVitalLoading.set(false))
        )
      )
    );
  }

  tabChanged(event: number) {
    this.activeTab = event;

    console.log(event);
    this.tabChange$.next(++event);
  }

  ngOnInit() {
    this.vitalsForm = new FormGroup({
      temperature: new FormControl('', [Validators.required]),
      pulse: new FormControl('', [Validators.required]),
      systolicBP: new FormControl('', [Validators.required]),
      diastolicBP: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      spO2: new FormControl('', [Validators.required]),
      respiratoryRate: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required]),
      headCircumference: new FormControl('', [Validators.required]),
      bsr: new FormControl('', [Validators.required]),
      id: new FormControl(''),
    });
  }

  resetVitals() {
    this.vitalsForm.reset();
    this.patientId$.next(-1);
  }

  submitVitals() {
    if (this.vitalsForm.valid) {
      const patientVitals: PatientVitals = {
        id:
          this.vitalsForm.get('id')?.value != 0
            ? this.vitalsForm.get('id')?.value
            : 0,
        patientId: this.patientId$.value,
        temperature: this.vitalsForm.get('temperature')?.value,
        pulse: this.vitalsForm.get('pulse')?.value,
        bloodPressureSystolic: this.vitalsForm.get('systolicBP')?.value,
        bloodPressureDiastolic: this.vitalsForm.get('diastolicBP')?.value,
        spo2: this.vitalsForm.get('spO2')?.value,
        weight: this.vitalsForm.get('weight')?.value,
        timeStamp: new Date().toISOString(),
        active: true,
        visitNo: '',
        isInPatient: false,
        respiratoryRate: this.vitalsForm.get('respiratoryRate')?.value,
        height: this.vitalsForm.get('height')?.value,
        headCircumference: this.vitalsForm.get('headCircumference')?.value,
        bsr: this.vitalsForm.get('bsr')?.value,
      };

      console.log(patientVitals);
      // Add the logic to submit the form

      this.patientQueue.addOrUpdatePatientVitals(patientVitals).subscribe({
        next: (data) => {
          console.log(data);
          this.refreshVitals$.next(!this.refreshVitals$.value);
          if (data.message) {
            this.notify.showSuccess(data.message);
            this.resetVitals();
          } else {
            this.notify.showError('Failed to submit vitals. Please try again.');
          }
        },

        error: (error) => {
          this.notify.showError('Failed to submit vitals. Please try again.');
        },
      });
    } else {
      this.notify.showError('Please fill in all required fields.');
    }
  }

  displayVitals(patient: PatientCheckInDetails) {
    this.patientId$.next(patient.patientID);
    this.displayVitalsDialog.set(true);
  }

  onVitalSelection(event: TableRowSelectEvent) {
    const patientVitals: PatientVitals = event.data;
    this.vitalsForm.patchValue({
      temperature: patientVitals.temperature,
      pulse: patientVitals.pulse,
      systolicBP: patientVitals.bloodPressureSystolic,
      diastolicBP: patientVitals.bloodPressureDiastolic,
      spO2: patientVitals.spo2,
      weight: patientVitals.weight,
      respiratoryRate: patientVitals.respiratoryRate,
      height: patientVitals.height,
      headCircumference: patientVitals.headCircumference,
      bsr: patientVitals.bsr,
      id: patientVitals.id,
    });
  }
}
