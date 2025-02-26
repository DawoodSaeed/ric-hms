import { Component, inject, OnInit, signal } from '@angular/core';
import { AccountService } from '../../services/account.service';
import {
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { Button, ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Role, User } from '../../interfaces/account';
import { CommonModule } from '@angular/common';
import { InputNumber } from 'primeng/inputnumber';
import { Checkbox } from 'primeng/checkbox';
import { Dialog } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Message } from 'primeng/message';
import { InputText } from 'primeng/inputtext';
import { NotificationService } from '../../services/notification.service';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../../shared/models/employee';
import { Select } from 'primeng/select';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-management',
  imports: [
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    CommonModule,
    Checkbox,
    Dialog,
    ReactiveFormsModule,
    Message,
    InputText,
    Select,
    DropdownModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private employeesService = inject(EmployeeService);
  private notify = inject(NotificationService);
  userForm!: FormGroup;
  displayDialog = signal(false);
  users$: Observable<User[]>;
  employees$: Observable<Partial<Employee>[]>;
  roles$: Observable<Role[]>;
  isLoading = signal(true);
  loggedInUserId!: number;
  constructor(private fb: FormBuilder) {
    this.users$ = this.accountService.user$.pipe(
      catchError(() => {
        this.notify.showError('');
        return throwError(() => new Error('Failed to fetch the data'));
      }),
      tap(() => this.isLoading.set(false))
    );
    this.employees$ = this.employeesService.employee$.pipe(
      map((employee) => {
        return employee
          .map((employee) => {
            return { empId: employee.empId, firstName: employee.firstName };
          })
          .filter((employee) => employee.firstName);
      })
    );

    this.roles$ = this.accountService.roles$;

    combineLatest([]);
  }

  clear(table: Table) {
    table.clear();
  }

  deleteUser(rowData: User) {
    console.log('Deleting the user: ');
    console.log(rowData);
    this.accountService.deleteUser(rowData.userId).subscribe({
      next: (message) => {
        console.log(message);
      },
      error: (error) => {
        this.notify.showError('Failed to delete the user.');
      },
    });
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      empId: [null, Validators.required],
      roleId: [null, Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      status: [false],
    });

    this.authService.loggedInUserId$.subscribe({
      next: (userId) => {
        this.loggedInUserId = parseInt(userId);
      },

      error: () => {
        this.notify.showError('Failed to fetch the user id. Cant proceed.');
      },
    });
  }

  submitForm() {
    if (
      this.userForm.invalid &&
      this.userForm.get('empId')?.value &&
      this.userForm.get('roleId')?.value &&
      this.loggedInUserId
    ) {
      this.notify.showError('Fill out the required field first.');
      return;
    }

    const newUser: User = {
      userId: 0,
      empId: this.userForm.get('empId')?.value,
      userName: this.userForm.get('userName')?.value ?? '',
      password: this.userForm.get('password')?.value ?? '',
      status: this.userForm.get('status')?.value == true ? 1 : 0,
      createdById: this.loggedInUserId,
      createdOn: new Date().toISOString(),
      modifiedById: 0,
      modifiedOn: new Date().toISOString(),
    };

    console.log(newUser);

    this.accountService
      .registerUser(newUser, this.userForm.get('roleId')?.value)
      .subscribe({
        next: (message) => {
          console.log(message);
        },

        error: (error) => {
          console.log(error);
          this.notify.showError(
            'There was an error while registering the user'
          );
        },
      });
  }
}
