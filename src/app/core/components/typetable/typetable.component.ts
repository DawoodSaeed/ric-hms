import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { TypeTableService } from '../../services/type-table.service';
import { MessageService } from 'primeng/api';
import {
  Bank,
  TypeTable,
  WorkingSession,
  DepartmentCategory,
  EducationDegree,
  EducationInstitution,
  FieldOfStudy,
  JobType,
  OrganizationType,
  PatientType,
  Scale,
  CheckInType,
  DiscountType,
  EmploymentStatus,
  Facility,
  GuardianType,
  PaymentMethod,
  Relation,
  Religion,
  PatientCheckInStatus,
  Country,
  Province,
} from '../../interfaces/typetable';

// Import PrimeNG modules used in the template
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { TableComponent } from '../table/table.component';

interface Cols {
  field: string;
  header: string;
}

@Component({
  standalone: true,
  selector: 'app-typetable-manager',
  templateUrl: './typetable.component.html',
  styleUrls: ['./typetable.component.css'],
  providers: [MessageService],
  imports: [
    // Import PrimeNG modules here
    CommonModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    FormsModule,
    TableComponent,
  ],
})
export class TypetableManagerComponent implements OnInit {
  data = signal<any[]>([]);
  selectedBank?: Bank;
  cols = signal<Cols[]>([]);
  globalFilters = signal<string[]>([]);
  displayDialog = signal(false);
  newProvince: Province = {
    name: '',
    code: '',
    cid: 0, // Default value, adjust as needed
    description: '',
    status: 1, // Or true, depending on your backend
    isActive: 1, // Or true, depending on your backend
  };

  constructor(private typeTableService: TypeTableService) {}

  ngOnInit(): void {
    this.fetchBanks();
  }

  fetchBanks() {
    this.typeTableService.getProvinces().subscribe((itm) => {
      this.data.set(itm);
    });
  }

  showDialog() {
    this.newProvince = {
      name: '',
      code: '',
      cid: 0, // Default value, adjust as needed
      description: '',
      status: 1, // Or true, depending on your backend
      isActive: 1, // Or true, depending on your backend
    };
    this.displayDialog.set(true);
  }

  addProvince() {
    if (
      this.newProvince.name &&
      this.newProvince.code &&
      this.newProvince.cid !== undefined &&
      this.newProvince.cid !== null &&
      this.newProvince.description
    ) {
      this.typeTableService
        .addUpdateBankProvince(this.newProvince)
        .subscribe(() => {
          // You might want to emit an event or use a service to notify the parent component
          // that a new province has been added, so it can refresh the data.
          this.displayDialog.set(false);
          this.newProvince = {
            name: '',
            code: '',
            cid: 0, // Default value, adjust as needed
            description: '',
            status: 1, // Or true, depending on your backend
            isActive: 1, // Or true, depending on your backend
          };
        });
    }
  }
}
