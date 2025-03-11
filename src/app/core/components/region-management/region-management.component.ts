import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { AccountService } from '../../services/account.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  of,
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
import { City, Country, District, Province, Religion } from '../../interfaces/typetable';
import { TypeTableService } from '../../services/type-table.service';
import { Tag } from 'primeng/tag';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-region-management',
  imports: [
    ConfirmDialogModule,
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
  providers: [MessageService, ConfirmationService],
})
export class RegionManagementComponent implements OnInit {
  private typeTableService = inject(TypeTableService);
  dataType: string | undefined;
  formState = signal<'editItem' | 'addItem'>('addItem');
  displayDialogBox = signal(false);
  data$!: Observable<Country[] | Province[] | City[] | District[]| Religion[]>;
  countries$!: Observable<Country[]>;
  provinces$!: Observable<Province[]>;
  selectedCountry!: Country | undefined;
  selectedProvince!: Province | undefined;
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

  newProvince: Province = {
    id: 0,
    name: '',
    code: '',
    countryId: 0,
    status: 1,
    ...this.getCommonFields(),
  };

  newDistrict: District = {
    id: 0,
    name: '',
    provinceId: 0,
    countryId: 0,
    status: 1,
    ...this.getCommonFields(),
  };

  newCity: City = {
    id: 0,
    name: '',
    countryId: 0,
    provinceId: 0,
    status: 1,
    ...this.getCommonFields(),
  };

  newReligion: Religion = {
    id: 0,
    name: '',
    description: '',
    isActive: 1,
    ...this.getCommonFields(),
  };
  selectedItem: any;

  constructor(
    public confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}
  ngOnInit(): void {
    this.dataType = this.route.snapshot.data['dataType'];
    this.loadData();
  }
  loadData() {
    switch (this.dataType) {
      case 'Country':
        this.data$ = this.typeTableService.getCountries();
        break;
      case 'Province':
        this.data$ = this.typeTableService.getAllProvinces();
        this.getCountryData();
        break;
      case 'District':
        this.data$ = this.typeTableService.getAllDistricts();
        this.getCountryData();
        break;
      case 'City':
        this.data$ = this.typeTableService.getCities();
        this.getCountryData();
        break;
      case 'Religion':
        this.data$ = this.typeTableService.getReligions();
        break;
      default:
        this.data$ = of([]);
    }

    this.tableHeadings$ = this.data$.pipe(
      map((data) => this.getTableHeadings(data))
    );
  }
  getCountryData() {
    this.countries$ = this.typeTableService.getCountries();
  }

  getRegionTitle() {
    return this.route.snapshot.data['title'];
  }

  getTableHeadings(tableData: any[] | null): any[] {
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
  onDropdownChange(event: any, name: string) {
    if (name === 'country' && event) {
      console.log(event);
      this.newProvince.countryId = event.id;
      this.newDistrict.countryId = event.id;
      this.newCity.countryId = event.id;
      if (this.dataType === 'District' || this.dataType === 'City') {
        this.typeTableService.setCountryID(event.id);
        this.provinces$ = this.typeTableService.getProvincesCountryWise();
      }
    } else if (name === 'province' && event) {
      console.log(event);
      this.newDistrict.provinceId = event.id;
      this.newCity.provinceId = event.id;
    }
  }
  getCommonFields() {
    const timestamp = new Date().toISOString();
    return {
      createdById: 0,
      createdOn: timestamp,
      modifiedById: 16,
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
    this.formState.set('editItem');
    this.displayDialogBox.set(true);
    if (this.dataType === 'Country') {
      this.newCountry = rowData;
    } else if (this.dataType === 'Province') {
      this.newProvince = rowData;
      this.countries$
        .pipe(
          map((response) => {
            console.log('xx ', response);
            console.log('rowData.id ', rowData.id);
            return response.find((country) => country.id === rowData.countryId);
          })
        )
        .subscribe({
          next: (data) => {
            console.log('chish ', data);
            this.selectedCountry = data;
          },
        });
    } else if (this.dataType === 'District' || this.dataType === 'City') {
      this.newDistrict = rowData;
      this.newCity = rowData;
      this.countries$
        .pipe(
          map((response) => {
            return response.find((country) => country.id === rowData.countryId);
          })
        )
        .subscribe({
          next: (data) => {
            console.log('chish ', data);
            this.selectedCountry = data;
          },
        });

      this.provinces$
        .pipe(
          map((response) => {
            console.log('pp ', response);
            console.log('rowData.id ', rowData.id);
            return response.find(
              (province) => province.id === rowData.provinceId
            );
          })
        )
        .subscribe({
          next: (data) => {
            console.log('chish ', data);
            this.selectedProvince = data;
          },
        });
    }else if(this.dataType==='Religion'){
       this.newReligion=rowData
    }
  }

  addOrUpdateItem() {
    console.log(this.newCountry);
    if (this.dataType === 'Country') {
      this.typeTableService.addUpdateCountry(this.newCountry).subscribe({
        next: (data: any) => {
          console.log(data);
          if (data) {
            this.loadData();
            this.notificationService.showSuccess('Operation successful!');
            this.displayDialogBox.set(false);
          }
        },
        error: (err) => {
          console.log(err);
          this.notificationService.showError(err.error.message);
        },
      });
    } else if (this.dataType === 'Province') {
      this.typeTableService.addUpdateProvince(this.newProvince).subscribe({
        next: (data: any) => {
          console.log(data);
          if (data) {
            this.loadData();
            this.notificationService.showSuccess('Operation successful!');
            this.displayDialogBox.set(false);
          }
        },
        error: (err) => {
          console.log(err);
          this.notificationService.showError(err.error.message);
        },
      });
    } else if (this.dataType === 'District') {
      this.typeTableService.addUpdateDistricts(this.newDistrict).subscribe({
        next: (data: any) => {
          console.log(data);
          if (data) {
            this.loadData();
            this.notificationService.showSuccess('Operation successful!');
            this.displayDialogBox.set(false);
          }
        },
        error: (err) => {
          console.log(err);
          this.notificationService.showError(err.error.message);
        },
      });
    } else if (this.dataType === 'City') {
      this.typeTableService.addUpdateCities(this.newCity).subscribe({
        next: (data: any) => {
          console.log(data);
          if (data) {
            this.loadData();
            this.notificationService.showSuccess('Operation successful!');
            this.displayDialogBox.set(false);
          }
        },
        error: (err) => {
          console.log(err);
          this.notificationService.showError(err.error.message);
        },
      });
    } else if (this.dataType === 'Religion') {
      console.log('yuuu ',this.newReligion)
      this.typeTableService.addUpdateReligion(this.newReligion).subscribe({
        next: (data: any) => {
          console.log(data);
          if (data) {
            this.loadData();
            this.notificationService.showSuccess('Operation successful!');
            this.displayDialogBox.set(false);
          }
        },
        error: (err) => {
          console.log(err);
          this.notificationService.showError(err.error.message);
        },
      });
    }
  }
  deleteItemConfirmation(rowData: any) {
    if (rowData) {
      console.log('deleting ', rowData);
      this.selectedItem = rowData;
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this item?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteItem();
        },
        reject: () => {
          this.confirmationService.close();
          console.log('Action canceled.');
          return;
        },
      });
    }
  }
  deleteItem() {
    if (this.dataType === 'Country') {
      let newCountry = {
        ...this.selectedItem,
        status: 0,
      };
      this.typeTableService.addUpdateCountry(newCountry).subscribe({
        next: (response: any) => {
          console.log(response);
          this.loadData();
          this.confirmationService.close();
          this.notificationService.showSuccess('Operation successful!');
        },
        error: (err) => {
          this.confirmationService.close();
          this.notificationService.showError(err.error.message);
        },
      });
    } else if (this.dataType === 'Province') {
      let newProvince = {
        ...this.selectedItem,
        status: 0,
      };
      this.typeTableService.addUpdateProvince(newProvince).subscribe({
        next: (response: any) => {
          console.log(response);
          this.loadData();
          this.confirmationService.close();
          this.notificationService.showSuccess('Operation successful!');
        },
        error: (err) => {
          this.confirmationService.close();
          this.notificationService.showError(err.error.message);
        },
      });
    } else if (this.dataType === 'District') {
      let newDistrict = {
        ...this.selectedItem,
        status: 0,
      };
      this.typeTableService.addUpdateDistricts(newDistrict).subscribe({
        next: (response: any) => {
          console.log(response);
          this.loadData();
          this.confirmationService.close();
          this.notificationService.showSuccess('Operation successful!');
        },
        error: (err) => {
          this.confirmationService.close();
          this.notificationService.showError(err.error.message);
        },
      });
    } else if (this.dataType === 'City') {
      let newCity = {
        ...this.selectedItem,
        status: 0,
      };
      console.log('payload ', newCity);
      this.typeTableService.addUpdateCities(newCity).subscribe({
        next: (response: any) => {
          console.log(response);
          this.loadData();
          this.confirmationService.close();
          this.notificationService.showSuccess('Operation successful!');
        },

        error: (err) => {
          this.confirmationService.close();
          this.notificationService.showError(err.error.message);
        },
      });
    } else if (this.dataType === 'Religion') {
      let newReligion = {
        ...this.selectedItem,
        isActive: 0,
      };
      console.log('payload ', newReligion);
      this.typeTableService.addUpdateReligion(newReligion).subscribe({
        next: (response: any) => {
          console.log(response);
          this.loadData();
          this.confirmationService.close();
          this.notificationService.showSuccess('Operation successful!');
        },

        error: (err) => {
          this.confirmationService.close();
          this.notificationService.showError(err.error.message);
        },
      });
    }
  }
}
