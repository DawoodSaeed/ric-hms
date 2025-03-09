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

@Component({
  selector: 'app-region-management',
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
  templateUrl: './region-management.component.html',
  styleUrl: './region-management.component.scss',
})
export class RegionManagementComponent {
private typeTableService=inject(TypeTableService)
  countries$:Observable<Country[]>;
  tableHeadings$:Observable<any[]|null>;
  constructor(){
    this.countries$=this.typeTableService.getCountries()
    this.tableHeadings$=this.countries$.pipe(map((countries)=>this.getTableHeadings(countries)))
  }
getTableHeadings(tableData:Country[]|null):any[]{
  if(!tableData|| tableData.length===0) return []
  return Object.keys(tableData[0]).filter((heading:any)=>!['currencyCode','id','modifiedById','modifiedOn','createdById','createdOn'].includes(heading))
}
  trackByID(index:number, item:Country){
    console.log('index ',index,' item ',item)
    return item.id
  }
}
