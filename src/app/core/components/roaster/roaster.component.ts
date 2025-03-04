import { Component, inject, OnInit, signal } from '@angular/core';
import { RoasterService } from '../../services/roaster.service';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { OrganisationService } from '../../services/organisation.service';
import { Department } from '../../interfaces/organisation';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NotificationService } from '../../services/notification.service';
import { Roaster } from '../../interfaces/roaster.interface';
import { DatePickerModule } from 'primeng/datepicker';
import { AuthService } from '../../services/auth.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-roaster',
  imports: [
    DatePickerModule,
    DialogModule,
    ReactiveFormsModule,
    MessageModule,
    SelectModule,
    CommonModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    BreadcrumbComponent,
    TableModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
  ],
  templateUrl: './roaster.component.html',
  styleUrl: './roaster.component.scss',
})
export class RoasterComponent implements OnInit {
  private roasterService = inject(RoasterService);
  private organizationService = inject(OrganisationService);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);
  private fb = inject(FormBuilder);
  displayDialog = signal(false);
  roasterForm!: FormGroup;
  userId = signal(0);
  isLoading = signal(true);
  // Observables #################################
  departments$!: Observable<Department[]>;
  roaster$!: Observable<Roaster[]>;
  refreshRoaster = new BehaviorSubject<Boolean>(false);
  filterDepartmentId = new Subject<number>();

  ngOnInit(): void {
    this.roaster$ = this.refreshRoaster.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.roasterService.getAllRoasters()),
      tap(() => this.isLoading.set(false))
    );

    this.departments$ = this.organizationService.getAllDepartments();

    this.authService.loggedInUserId$.subscribe({
      next: (userId) => {
        this.userId.set(parseInt(userId));
      },

      error: (error) => {
        console.log(error);
        this.notify.showError('Could not fetched the user id');
      },
    });

    this.roasterForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      department: [null, Validators.required],
      month: ['', Validators.required],
      status: [false],
    });
  }

  submitForm() {
    if (this.roasterForm.invalid) {
      this.notify.showError('Please fill all the required fields.');
      this.roasterForm.setErrors({ allrequired: true });
      return;
    }

    if (!this.userId()) {
      this.notify.showError('User Id is not provided.');
      return;
    }

    const newRoaster: Roaster = {
      name: this.roasterForm.get('title')?.value,
      description: this.roasterForm.get('description')?.value,
      branchId: 1,
      isActive: this.roasterForm.get('status') ? 1 : 0,
      departmentId: this.roasterForm.get('department')?.value,
      month: this.getMonthFromISO(this.roasterForm.get('month')?.value),
      year: this.getYearFromISO(this.roasterForm.get('month')?.value),
      createdById: this.userId(),
    };

    this.roasterService.addRoaster(newRoaster).subscribe({
      next: (message) => {
        console.log(message);
        this.notify.showSuccess('Roaster is added.');
        this.displayDialog.set(false);
        this.refreshRoaster.next(!this.refreshRoaster.value);
      },

      error: (error) => {
        console.log(error);
        this.notify.showError('Roaster was not added succesfuly.');
      },
    });
  }

  clear(table: Table) {
    table.clear();
  }

  // Helper Methods. ########################################
  getMonthFromISO(isoString: string): number {
    console.log(isoString);
    const date: Date = new Date(isoString);

    // If you want the month in the local timezone:
    return date.getMonth() + 1; // Returns a number (1-12)

    // If you want the month in UTC (Coordinated Universal Time):
    // return date.getUTCMonth() + 1; // Returns a number (1-12)
  }

  getYearFromISO(isoString: string): number {
    const date: Date = new Date(isoString);

    // If you want the year in the local timezone:
    return date.getFullYear();

    // If you want the year in UTC:
    // return date.getUTCFullYear();
  }
}
