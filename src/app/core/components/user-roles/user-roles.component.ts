import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AccountService } from '../../services/account.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  switchMap,
  take,
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
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-user-roles',
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
    DropdownModule,
    BreadcrumbComponent,
  ],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.scss',
})
export class UserRolesComponent implements OnInit {
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);
  userForm!: FormGroup;
  displayDialog = signal(false);
  roles$: Observable<Role[]>;
  isLoading = signal(true);
  loggedInUserId!: number;

  newRole: Role = {
    id: 0,
    name: '',
    description: '',
    createdOn: new Date().toISOString(),
    createdById: 0,
    modifiedOn: new Date().toISOString(),
    modifiedById: 0,
    isActive: 0,
  };

  refreshSub = new BehaviorSubject<void>(undefined); // Emit a void value to trigger refresh

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.roles$ = this.refreshSub.asObservable().pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() =>
        this.accountService.roles$.pipe(
          tap(() => this.isLoading.set(false)),
          catchError((error) => {
            this.notify.showError('Failed to fetch roles.');
            return throwError(error);
          })
        )
      )
    );
  }

  clear(table: Table) {
    table.clear();
  }

  // deleteUser(rowData: User) {
  //   console.log('Deleting the user: ');
  //   console.log(rowData);
  //   this.accountService.deleteUser(rowData.userId).subscribe({
  //     next: (message) => {
  //       console.log(message);
  //       this.refreshSub.next(); // Trigger refresh after deletion
  //     },
  //     error: (error) => {
  //       this.notify.showError('Failed to delete the user.');
  //     },
  //   });
  // }

  editRole(rowData: Role) {
    this.userForm.setValue({
      name: rowData.name,
      description: rowData.description,
      status: rowData.isActive ? true : false,
    });

    this.displayDialog.set(true);
    this.newRole.id = rowData.id;
    this.newRole.createdById = rowData.createdById;
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
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
      this.userForm.invalid ||
      !this.userForm.get('name')?.value ||
      !this.userForm.get('description')?.value ||
      !this.loggedInUserId
    ) {
      this.notify.showError('Fill out the required field first.');
      return;
    }

    const addRole: Role = {
      id: this.newRole.id || 0,
      name: this.userForm.get('name')?.value,
      description: this.userForm.get('description')?.value,
      createdOn: new Date().toISOString(),
      createdById: this.newRole.createdById || this.loggedInUserId,
      modifiedOn: new Date().toISOString(),
      modifiedById: this.loggedInUserId,
      isActive: this.userForm.get('status')?.value ? 1 : 0,
    };

    console.log(addRole);

    this.accountService.createRole(addRole).subscribe({
      next: () => {
        this.refreshSub.next(); // Trigger refresh after creation
        this.displayDialog.set(false);
        this.cdr.detectChanges();
      },
      error: () => this.notify.showError("Couldn't create the role"),
    });
  }

  closeDialog() {
    this.newRole = {
      id: 0,
      name: '',
      description: '',
      createdOn: new Date().toISOString(),
      createdById: 0,
      modifiedOn: new Date().toISOString(),
      modifiedById: 0,
      isActive: 0,
    };
  }
}
