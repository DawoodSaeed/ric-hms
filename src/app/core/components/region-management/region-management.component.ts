import { Component, inject, OnInit, Signal, signal } from '@angular/core';
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
import { TooltipModule } from 'primeng/tooltip';
import { PasswordModule } from 'primeng/password';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { Country } from '../../interfaces/typetable';
import { TypeTableService } from '../../services/type-table.service';
import { Tag } from 'primeng/tag';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-region-management',
  imports: [
    FormsModule,
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
    Tag,
  ],
  templateUrl: './region-management.component.html',
  styleUrl: './region-management.component.scss',
})
export class RegionManagementComponent implements OnInit {
  private typeTableService = inject(TypeTableService);
  dataType: string | undefined;
  formState = signal<'editItem' | 'addItem'>('addItem');
  displayDialogBox = signal(false);
  countries$!: Observable<Country[]>;
  tableHeadings$!: Observable<any[] | null>;

  newCountry: Country = {
    id: 0,
    name: '',
    code: '',
    phoneCode: '',
    currencyCode: '',
    status: 1,
    ...this.getCommonFields(),
  };

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}
  ngOnInit(): void {
    this.dataType = this.route.snapshot.data['dataType'];
    this.loadData();
  }
  loadData() {
    this.countries$ = this.typeTableService.getCountries();
    this.tableHeadings$ = this.countries$.pipe(
      map((countries) => this.getTableHeadings(countries))
    );
  }
  getTableHeadings(tableData: Country[] | null): any[] {
    if (!tableData || tableData.length === 0) return [];
    return Object.keys(tableData[0]).filter(
      (heading: any) =>
        ![
          'id',
          'modifiedById',
          'modifiedOn',
          'createdById',
          'createdOn',
        ].includes(heading)
    );
  }
  trackByID(index: number, item: Country) {
    return item.id;
  }
  getCommonFields() {
    const timestamp = new Date().toISOString();
    return {
      createdById: 0,
      createdOn: timestamp,
      modifiedById: 0,
      modifiedOn: timestamp,
    };
  }
  getTagValue(status: number): string | undefined {
    if (status === 1) {
      return 'Active';
    } else {
      return 'In-Active';
    }
  }

  editItem(rowData: any) {
    console.log(rowData);
    this.displayDialogBox.set(true);
  }

  addOrUpdateItem() {
    console.log(this.newCountry);
    this.typeTableService.addUpdateCountry(this.newCountry).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data) {
          this.loadData()
          this.notificationService.showSuccess('Operation successful!');
          this.displayDialogBox.set(false)
        }
      },
      error:(err)=>{
        console.log(err)
          this.notificationService.showError(err.error.message);

      }
    });
  }
}
