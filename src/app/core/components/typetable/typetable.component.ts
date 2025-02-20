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
  District,
  City,
  Designation,
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
  newDesignation: Designation = {
    name: '',
    description: '',
    isActive: 1,
  };

  constructor(private typeTableService: TypeTableService) {}

  ngOnInit(): void {
    this.fetchBanks();
  }

  fetchBanks() {
    this.typeTableService.getDesignations().subscribe((itm) => {
      this.data.set(itm);
    });
  }

  showDialog() {
    this.displayDialog.set(true);
  }

  addDesignation() {
    if (this.newDesignation.name && this.newDesignation.description) {
      this.typeTableService
        .addUpdateDesignations(this.newDesignation)
        .subscribe(() => {
          this.displayDialog.set(false);
          this.newDesignation = {
            name: '',
            description: '',
            isActive: 1,
          };
        });
    }
  }
}
