import {
  Bank,
  CheckInType,
  DepartmentCategory,
  DiscountType,
  GuardianType,
  JobType,
  OrganizationType,
  PatientCheckInStatus,
  PatientType,
  PaymentMethod,
  TypeTable,
} from './../../interfaces/typetable';
import { OrganisationService } from './../../services/organisation.service';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import {
  City,
  Country,
  Designation,
  District,
  EducationDegree,
  EducationInstitution,
  Province,
  Religion,
} from '../../interfaces/typetable';
import { TypeTableService } from '../../services/type-table.service';
import { Tag } from 'primeng/tag';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Department } from '../../interfaces/organisation';
import { Branch } from '../../interfaces/branch.interface';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-region-management',
  imports: [
    InputNumberModule,
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
  private organizatoinService = inject(OrganisationService);
  private branchService = inject(BranchService);

  dataType: string | undefined;
  formState = signal<'editItem' | 'addItem'>('addItem');
  displayDialogBox = signal(false);
  data$!: Observable<Country[] | Province[] | City[] | District[] | Religion[]>;
  countries$!: Observable<Country[]>;
  provinces$!: Observable<Province[]>;
  departmentCats$!: Observable<DepartmentCategory[]>;
  discountTypes$!: Observable<DiscountType[]>;
  branches$!: Observable<Branch[]>;

  selectedCountry!: Country | undefined;
  selectedProvince!: Province | undefined;
  selectedDepartmentCat!: DepartmentCategory | undefined;
  selectedDiscountType!: DiscountType | undefined;
  selectedBranch!: Branch | undefined;
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

  // Following will be relocated
  newDegree: EducationDegree = {
    id: 0,
    name: '',
    description: '',
    isActive: 1,
    ...this.getCommonFields(),
  };

  newInstitute: EducationInstitution = {
    id: 0,
    name: '',
    description: '',
    isActive: 1,
    ...this.getCommonFields(),
  };

  newDesignation: Designation = {
    desgnId: 0,
    name: '',
    description: '',
    isActive: 1,
    ...this.getCommonFields(),
  };

  newDepartment: Department = {
    did: 0,
    name: '',
    description: '',
    code: '',
    deptCatId: 0,
    canCheckIn: 0,
    isInPatient: 0,
    isSurgical: 0,
    amount: 0,
    discountTypeId: 0,
    discount: 0,
    discountedAmount: 0,
    status: 1,
    ...this.getCommonFields(),
  };

  newDepartmentCategories: DepartmentCategory = {
    id: 0,
    name: '',
    description: '',
    branchId: 0,
    isActive: 1,
    ...this.getCommonFields(),
  };

  newOrgTypes: OrganizationType = {
    id: 0,
    name: '',
    description: '',
    isActive: 1,
  };

  newJobType: JobType = {
    id: 0,
    name: '',
    description: '',
    isDeleted: false,
    isActive: 0,
    enableGp: false,
    enableGi: false,
    enableBf: false,
    value: 0,
    enableIncomeTax: false,
    enableServiceTax: false,
    isHonorary: false,
    branchId: 0,
  };

  newPatientType: PatientType = {
    id: 0,
    name: '',
    description: '',
    isActive: 1,
  };
  newPatientCheckInStatus: PatientCheckInStatus = {
    id: 0,
    name: '',
    description: '',
    isActive: 1,
  };

  newCheckInType: CheckInType = {
    id: 0,
    name: '',
    description: '',
    isActive: 1,
  };

  newGuardianType: GuardianType = {
    id: 0,
    name: '',
    description: '',
    isActive: 1,
  };
  newBloodGroup: TypeTable = {
    id: 0,
    name: '',
    description: '',
    isActive: 1,
  };

  newPaymentMethod: PaymentMethod = {
    id: 0,
    name: '',
    description: '',
    branchId: 0,
    isActive: 1,
  };

  newDiscountType: DiscountType = {
    id: 0,
    name: '',
    description: '',
    isActive: 1,
  };
  newChargesType: TypeTable = {
    id: 0,
    name: '',
    description: '',
    isActive: 1,
  };

  newBank: Bank = {
    id: 0,
    name: '',
    description: '',
    abbrivation: '',
    code: '',
    isActive: 1,
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
      case 'Degree':
        this.data$ = this.typeTableService.getEducationDegrees();
        break;
      case 'Institue':
        this.data$ = this.typeTableService.getEducationInstitutions();
        break;
      case 'Designation':
        this.data$ = this.typeTableService.getDesignations();
        break;
      case 'Department':
        this.data$ = this.organizatoinService.getAllDepartments();
        this.getDeparmentCats();
        this.getDiscountTypes();
        break;
      case 'deptCats':
        this.data$ = this.typeTableService.getDepartmentCategories();
        this.getBranches();
        break;
      case 'orgTypes':
        this.data$ = this.typeTableService.getOrganizationTypes();
        break;
      case 'jobTypes':
        this.data$ = this.typeTableService.getJobTypes();

        break;
      case 'patientTypes':
        this.data$ = this.typeTableService.getPatientTypes();
        break;
      case 'patientCheckInStatus':
        this.data$ = this.typeTableService.getPatientCheckInStatuses();
        break;
      case 'checkInTypes':
        this.data$ = this.typeTableService.getCheckInTypes();
        break;
      case 'guardianTypes':
        this.data$ = this.typeTableService.getGuardianTypes();
        break;
      case 'bloodGroups':
        this.data$ = this.typeTableService.getBloodGroups();
        break;
      case 'paymentmethods':
        this.data$ = this.typeTableService.getPaymentMethods();
        this.getBranches();
        break;
      case 'discountTypes':
      case 'chargesTypes':
        this.data$ = this.typeTableService.getChargesTypes();
        break;
      case 'Bank':
        this.data$ = this.typeTableService.getBanks();
        break;
      default:
        this.data$ = of([]);
    }

    this.tableHeadings$ = this.data$.pipe(
      map((data) => this.getTableHeadings(data))
    );
  }
  getRegionTitle() {
    return this.route.snapshot.data['title'];
  }
  getCountryData() {
    this.countries$ = this.typeTableService.getCountries();
  }
  getDeparmentCats() {
    this.departmentCats$ = this.typeTableService.getDepartmentCategories();
  }
  getDiscountTypes() {
    this.discountTypes$ = this.typeTableService.getDiscountTypes();
  }
  getBranches() {
    this.branches$ = this.branchService.getAllBranches();
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
          'countryId',
          'provinceId',
          'did',
          'deptCatId',
          'discountTypeId',
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

    if (name === 'departmentCat' && event) {
      this.newDepartment.deptCatId = event.id;
    }
    if (name === 'discountType' && event) {
      this.newDepartment.discountTypeId = event.id;
      // this.selectedDiscountType=event.name
      // console.log('selectedDiscountType ', this.selectedDiscountType);
    }
    if (name === 'branch' && event) {
      this.newDepartmentCategories.branchId = event.id;
      this.newJobType.branchId = event.id;
      this.newPaymentMethod.branchId = event.id;
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
    } else if (this.dataType === 'Religion') {
      this.newReligion = rowData;
    } else if (this.dataType === 'Degree') {
      this.newDegree = rowData;
    } else if (this.dataType === 'Institue') {
      this.newInstitute = rowData;
    } else if (this.dataType === 'Designation') {
      this.newDesignation = rowData;
    } else if (this.dataType === 'Department') {
      this.newDepartment = rowData;
    } else if (this.dataType === 'deptCats') {
      this.newDepartmentCategories = rowData;
    } else if (this.dataType === 'orgTypes') {
      this.newOrgTypes = rowData;
    } else if (this.dataType === 'jobTypes') {
      this.newJobType = rowData;
    } else if (this.dataType === 'patientTypes') {
      this.newPatientType = rowData;
    } else if (this.dataType === 'patientCheckInStatus') {
      this.newPatientCheckInStatus = rowData;
    } else if (this.dataType === 'checkInTypes') {
      this.newCheckInType = rowData;
    } else if (this.dataType === 'guardianTypes') {
      this.newGuardianType = rowData;
    } else if (this.dataType === 'bloodGroups') {
      this.newBloodGroup = rowData;
    } else if (this.dataType === 'paymentmethods') {
      this.newPaymentMethod = rowData;
    } else if (this.dataType === 'discountTypes') {
      this.newDiscountType = rowData;
    } else if (this.dataType === 'chargesTypes') {
      this.newChargesType = rowData;
    } else if (this.dataType === 'Bank') {
      this.newBank = rowData;
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
      console.log('yuuu ', this.newReligion);
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
    } else if (this.dataType === 'Degree') {
      console.log('Degree ', this.newDegree);
      this.typeTableService.addUpdateEducationDegree(this.newDegree).subscribe({
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
    } else if (this.dataType === 'Institue') {
      console.log('Institue ', this.newInstitute);
      this.typeTableService
        .addUpdateEducationInstitution(this.newInstitute)
        .subscribe({
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
    } else if (this.dataType === 'Designation') {
      this.typeTableService
        .addUpdateDesignations(this.newDesignation)
        .subscribe({
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
    } else if (this.dataType === 'Department') {
      this.organizatoinService
        .createOrUpdateDepartment(this.newDepartment)
        .subscribe({
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
    } else if (this.dataType === 'deptCats') {
      this.typeTableService
        .addUpdateDepartmentCategory(this.newDepartmentCategories)
        .subscribe({
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
    } else if (this.dataType === 'orgTypes') {
      this.typeTableService
        .addUpdateOrganizationType(this.newOrgTypes)
        .subscribe({
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
    } else if (this.dataType === 'jobTypes') {
      this.typeTableService.addUpdateJobType(this.newJobType).subscribe({
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
    } else if (this.dataType === 'patientTypes') {
      this.typeTableService
        .addUpdatePatientType(this.newPatientType)
        .subscribe({
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
    } else if (this.dataType === 'patientCheckInStatus') {
      this.typeTableService
        .addUpdatePatientCheckInStatuses(this.newPatientCheckInStatus)
        .subscribe({
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
    } else if (this.dataType === 'checkInTypes') {
      this.typeTableService
        .addUpdateCheckInType(this.newCheckInType)
        .subscribe({
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
    } else if (this.dataType === 'guardianTypes') {
      this.typeTableService
        .addUpdateGuardianType(this.newGuardianType)
        .subscribe({
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
    } else if (this.dataType === 'bloodGroups') {
      this.typeTableService.addUpdateBloodGroup(this.newBloodGroup).subscribe({
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
    } else if (this.dataType === 'paymentmethods') {
      this.typeTableService
        .addUpdatePaymentMethod(this.newPaymentMethod)
        .subscribe({
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
    } else if (this.dataType === 'discountTypes') {
      this.typeTableService
        .addUpdateDiscountType(this.newDiscountType)
        .subscribe({
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
    } else if (this.dataType === 'chargesTypes') {
      this.typeTableService
        .addUpdateChargesType(this.newChargesType)
        .subscribe({
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
    } else if (this.dataType === 'Bank') {
      this.typeTableService.addUpdateBank(this.newBank).subscribe({
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
    } else if (this.dataType === 'Degree') {
      let newDegree = {
        ...this.selectedItem,
        isActive: 0,
      };
      console.log('payload ', newDegree);
      this.typeTableService.addUpdateEducationDegree(newDegree).subscribe({
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
    } else if (this.dataType === 'Institue') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      console.log('payload ', newItem);
      this.typeTableService.addUpdateEducationInstitution(newItem).subscribe({
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
    } else if (this.dataType === 'Designation') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdateDesignations(newItem).subscribe({
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
    } else if (this.dataType === 'Department') {
      let newItem = {
        ...this.selectedItem,
        status: 0,
      };
      this.organizatoinService.createOrUpdateDepartment(newItem).subscribe({
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
    } else if (this.dataType === 'deptCats') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdateDepartmentCategory(newItem).subscribe({
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
    } else if (this.dataType === 'orgTypes') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdateOrganizationType(newItem).subscribe({
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
    } else if (this.dataType === 'jobTypes') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdateJobType(newItem).subscribe({
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
    } else if (this.dataType === 'patientTypes') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdatePatientType(newItem).subscribe({
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
    } else if (this.dataType === 'patientCheckInStatus') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdatePatientCheckInStatuses(newItem).subscribe({
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
    } else if (this.dataType === 'checkInTypes') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdateCheckInType(newItem).subscribe({
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
    } else if (this.dataType === 'guardianTypes') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdateGuardianType(newItem).subscribe({
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
    } else if (this.dataType === 'bloodGroups') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdateBloodGroup(newItem).subscribe({
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
    } else if (this.dataType === 'paymentmethods') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdatePaymentMethod(newItem).subscribe({
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
    } else if (this.dataType === 'discountTypes') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdateDiscountType(newItem).subscribe({
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
    } else if (this.dataType === 'chargesTypes') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdateChargesType(newItem).subscribe({
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
    } else if (this.dataType === 'Bank') {
      let newItem = {
        ...this.selectedItem,
        isActive: 0,
      };
      this.typeTableService.addUpdateBank(newItem).subscribe({
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

  calculateDiscountedAmount() {
    if (this.newDepartment.discountTypeId === 1) {
      this.newDepartment.discountedAmount =
        this.newDepartment.amount - this.newDepartment.discount;
    } else if (this.newDepartment.discountTypeId === 2) {
      this.newDepartment.discountedAmount =
        this.newDepartment.amount -
        (this.newDepartment.amount * this.newDepartment.discount) / 100;
    } else {
      this.newDepartment.discountedAmount = this.newDepartment.amount;
    }
  }
}
