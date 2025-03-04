// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-region-management',
//   imports: [],
//   

// })
// export class RegionManagementComponent {
// }

import { Component, inject, OnInit, signal } from '@angular/core';
import { AccountService } from '../../services/account.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { Button, ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ChangePassword, Role, User } from '../../interfaces/account';
import { CommonModule } from '@angular/common';
// import { InputNumber } from 'primeng/inputnumber';
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
import { TooltipModule } from 'primeng/tooltip';
import { PasswordModule } from 'primeng/password';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
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
    TooltipModule,
    PasswordModule,
    BreadcrumbComponent,
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
  chPwd!: FormGroup;
  displayDialog = signal(false);
  users$: Observable<User[]>;
  employees$: Observable<Partial<Employee>[]>;
  roles$: Observable<Role[]>;
  isLoading = signal(true);
  loggedInUserId!: number;
  selectRowId = signal(0);
  formState = signal<'changePassword' | 'resetPassword' | 'addUser'>('addUser');

  editUserData: User = {
    userId: 0,
    empId: 0,
    userName: '',
    password: '',
    status: 0,
    createdById: 0,
    createdOn: '',
    modifiedById: 0,
    modifiedOn: new Date().toISOString(),
  };

  refreshSub = new BehaviorSubject<boolean>(false);
  constructor(private fb: FormBuilder) {
    this.users$ = this.refreshSub.asObservable().pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() =>
        this.accountService.user$.pipe(
          catchError(() => {
            this.notify.showError('');
            return throwError(() => new Error('Failed to fetch the data'));
          }),
          tap(() => this.isLoading.set(false))
        )
      )
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
        this.refreshSub.next(!this.refreshSub.value);
      },
      error: (error) => {
        this.notify.showError('Failed to delete the user.');
      },
    });
  }

  ngOnInit() {
    // add an user form........
    this.userForm = this.fb.group({
      empId: [null, Validators.required],
      roleId: [null, Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      status: [false],
    });

    // change the password form
    this.chPwd = this.fb.group({
      currentPwd: [null, Validators.required],
      newPwd: [null, Validators.required],
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
      this.userForm.invalid ||
      !this.userForm.get('empId')?.value ||
      !this.userForm.get('roleId')?.value ||
      !this.loggedInUserId
    ) {
      this.notify.showError('Fill out the required field first.');
      return;
    }

    const newUser: User = {
      // For the edit i want to maintain the past userId, createdOn, createdBy
      userId: this.editUserData.userId || 0,
      createdById: this.editUserData.createdById || this.loggedInUserId,
      createdOn: this.editUserData.createdOn || new Date().toISOString(),

      empId: this.userForm.get('empId')?.value,
      userName: this.userForm.get('userName')?.value ?? '',
      password: this.userForm.get('password')?.value ?? '',
      status: this.userForm.get('status')?.value == true ? 1 : 0,
      modifiedById: this.loggedInUserId,
      modifiedOn: new Date().toISOString(),
    };

    console.log(newUser);

    this.accountService
      .registerUser(newUser, this.userForm.get('roleId')?.value)
      .subscribe({
        next: (message) => {
          console.log(message);
          this.displayDialog.set(false);
          this.refreshSub.next(!this.refreshSub.value);
        },

        error: (error) => {
          console.log(error);
          this.notify.showError(
            'There was an error while registering the user'
          );
        },
      });
  }

  changePassword(rowData: User, type: 'changePassword' | 'resetPassword') {
    console.log(rowData);
    this.selectRowId.set(rowData.userId);
    this.formState.set(type);
    this.displayDialog.set(true);
  }

  changePasswordFormSubmission() {
    if (
      this.chPwd.invalid ||
      !this.chPwd.get('currentPwd')?.value ||
      !this.chPwd.get('newPwd')?.value
    ) {
      this.notify.showError('Fill in all the required fields');
      return;
    }

    const changePassword: ChangePassword = {
      currentPassword: this.chPwd.get('currentPwd')?.value,
      newPassword: this.chPwd.get('newPwd')?.value,
      userId: this.selectRowId(),
    };
    this.accountService.changePassword(changePassword).subscribe({
      next: (message) => {
        console.log(message);
        this.notify.showSuccess('Password was changed succesfully');
        this.displayDialog.set(false);
      },

      error: (error) => {
        console.log(error);
        this.notify.showError(error.error.message);
      },
    });
  }

  resetPassword() {
    if (!this.chPwd.get('newPwd')?.value) {
      this.notify.showError(
        'Fill in all the required fields ( New Password ) '
      );
      return;
    }

    this.accountService
      .resetPassword({
        newPassword: this.chPwd.get('newPwd')?.value,
        userId: this.selectRowId(),
      })
      .subscribe({
        next: (message) => {
          console.log(message);
          this.notify.showSuccess('Password Reset was successful');
          this.displayDialog.set(false);
        },

        error: (error) => {
          this.notify.showError('Couldnt update the password');
          this.notify.showError(error.error.message);
        },
      });
  }

  editUser(rowData: any) {
    console.log(rowData);
    // empId: [null, Validators.required],
    //   roleId: [null, Validators.required],
    //   userName: ['', Validators.required],
    //   password: ['', Validators.required],
    //   status: [false],
    this.formState.set('addUser');
    this.displayDialog.set(true);

    // For the edit i want to maintain the record of which user created it,
    // And when it created the user
    // And what user id was .
    this.editUserData = {
      ...this.editUserData,

      createdById: rowData.createdById,
      userId: rowData.userId,
      createdOn: rowData.createdOn,
    };

    this.roles$.subscribe((roles) => {
      const role = roles.find((role) => role.name == rowData.role);
      this.userForm.setValue({
        empId: rowData.empId,
        userName: rowData.userName,
        roleId: role?.id,
        status: rowData.status ? true : false,
        password: rowData.password,
      });
    });
  }

  dialogClose() {
    this.editUserData = {
      userId: 0,
      empId: 0,
      userName: '',
      password: '',
      status: 0,
      createdById: 0,
      createdOn: '',
      modifiedById: 0,
      modifiedOn: new Date().toISOString(),
    };
  }
}
