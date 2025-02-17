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

interface Endpoint {
  name: string;
  type: any;
  postGetAll: boolean;
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
    FormsModule, // Add FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypetableManagerComponent implements OnInit {
  banks: Bank[] = [];
  selectedBank?: Bank;
  displayDialog = signal(false);
  newBank: Bank = {
    abbrivation: '',
    name: '',
    code: '',
    description: '',
    isActive: 1,
    bank: 0,
  };

  constructor(private typeTableService: TypeTableService) {}

  ngOnInit(): void {
    this.fetchBanks();
  }

  fetchBanks() {
    this.typeTableService.getBanks().subscribe((data) => {
      this.banks = data;
    });
  }

  showDialog() {
    this.newBank = {
      abbrivation: '',
      name: '',
      code: '',
      description: '',
      isActive: 1,
      bank: 0,
    };
    this.displayDialog.set(true);
  }

  addBank() {
    if (
      this.newBank.name &&
      this.newBank.abbrivation &&
      this.newBank.code &&
      this.newBank.description
    ) {
      this.typeTableService.addUpdateBank(this.newBank).subscribe(() => {
        this.fetchBanks();
        this.displayDialog.set(false);
      });
    }
  }
}
