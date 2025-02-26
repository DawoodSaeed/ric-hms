import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../shared/models/employee';

// PrimeNG Components
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { CustomSidebarComponent } from '../../../../core/components/custom-sidebar/custom-sidebar.component';
import { map } from 'rxjs';
import { TabViewModule } from 'primeng/tabview'; // For the tabs
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { SpeedDial } from 'primeng/speeddial';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ContextMenuModule } from 'primeng/contextmenu';
import { SkeletonModule } from 'primeng/skeleton';
import { Bank } from '../../../../core/interfaces/typetable';
import {
  Building,
  Floor,
  Room,
} from '../../../../core/interfaces/branch.interface';

interface cols {
  field: string;
  header: string;
}
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './employees.component.scss',
  templateUrl: './employees.component.html',
  imports: [
    CommonModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    AvatarModule,
    SidebarModule,
    PanelModule,
    DividerModule,
    RippleModule,
    CustomSidebarComponent,
    TabViewModule,
    PanelModule,
    PopoverModule,
    TableModule,
    ButtonModule,
    TagModule,
    SpeedDial,
    SelectButtonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    ContextMenuModule,
    SkeletonModule,
  ],
  providers: [MessageService],
})
export class EmployeesComponent {
  private employeeService = inject(EmployeeService);
  @Input() data!: Bank[] | Building[] | Room[] | Floor[];
  employees = signal<Employee[]>([]);
  cols = signal<cols[]>([]);
  selectedEmployee: Employee | null = null;
  employeeSidebarVisible = false;
  // Options for SelectButton
  viewOptions = [
    {
      label: 'Card View',
      value: 'card',
      icon: 'pi pi-th-large',
    },
    {
      label: 'Table View',
      value: 'table',
      icon: 'pi pi-table',
    },
  ];

  isCardView = signal(false);
  loading = signal(true);

  constructor(private messageService: MessageService) {
    this.employeeService.employee$
      .pipe(map((employees) => employees.slice(0, 12)))
      .subscribe({
        next: (data: Employee[]) => {
          console.log(data.length);
          const keys = Object.keys(data);
          const cols: cols[] = [];
          keys.forEach((key) => {
            cols.push({
              field: key,
              header: key,
            });
          });
          this.cols.set(cols);
          this.employees.set(data);
        },

        complete: () => {
          this.loading.set(false);
        },
      });
  }

  rowNumbers(rows: number): number[] {
    return Array.from({ length: rows }, (_, i) => i + 1);
  }

  showDetails(employee: Employee | null) {
    console.log(employee);
    if (employee) {
      this.selectedEmployee = employee;
      this.employeeSidebarVisible = true;
    }
  }

  closeDetails() {
    this.selectedEmployee = null;
    this.employeeSidebarVisible = false;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  setDefaultImage(event: Event) {
    (event.target as HTMLImageElement).src =
      'assets/images/placeholder_img.jpg';
  }

  // In your component.ts
  getJobTitle(jobTypeId: number | undefined): string {
    // Replace with your actual logic to fetch job title based on ID
    return jobTypeId ? 'Job Title ' + jobTypeId : 'N/A'; // Placeholder
  }

  getBloodGroup(bloodGroupId: number | undefined): string {
    // Replace with your actual logic to fetch blood group based on ID
    return bloodGroupId ? 'Blood Group ' + bloodGroupId : 'N/A'; // Placeholder
  }

  items: any[] = [];

  contextItems = [
    {
      icon: 'pi pi-eye',
      label: 'View Employee',
      command: () => {
        console.log(this.selectedEmployee);
        this.employeeSidebarVisible = true;
      },
    },
    {
      icon: 'pi pi-refresh',
      command: () => {
        this.employeeSidebarVisible = true;
      },
      label: 'Refresh Employee',
    },
    {
      icon: 'pi pi-trash',
      command: () => {
        this.employeeSidebarVisible = true;
      },
      label: 'Delete Employee',
    },
  ];
  getActionItems(employee: any) {
    return (this.items = [
      {
        icon: 'pi pi-eye',
        label: 'View Employee',
        command: () => {
          console.log('Clicked');
          this.showDetails(employee);
        },
      },
      {
        icon: 'pi pi-refresh',
        command: () => {
          console.log('Clicked');
          this.showDetails(this.selectedEmployee);
        },

        label: 'Refresh Employee',
      },
      {
        icon: 'pi pi-trash',
        command: () => {
          console.log('Clicked');
          this.showDetails(this.selectedEmployee);
        },

        label: 'Delete Employee',
      },
    ]);
  }

  viewEmployee(employee: any) {
    this.showDetails(employee);
  }

  editEmployee(employee: any) {
    console.log('Editing', employee);
  }

  deleteEmployee(employee: any) {
    console.log('Deleting', employee);
  }

  // Default View
  toggleView(event: SelectButtonChangeEvent) {
    const { value } = event.value;
    if (value == 'card') {
      this.isCardView.set(true);
    } else {
      this.isCardView.set(false);
    }
  }

  searchValue: string | undefined;

  clear(table: Table) {
    this.searchValue = '';

    // Clear sorting
    table.sortField = null;
    table.sortOrder = 1;
    table.multiSortMeta = null;

    // Clear filters
    table.clear();

    // Reset table state
    table.reset();

    // Clear session storage for this table
    const storageKey = table.stateKey ? `${table.stateKey}` : null;

    console.log(storageKey);
    if (storageKey) {
      sessionStorage.removeItem(storageKey);
    }

    // Force table to refresh
    table.onLazyLoad.emit({});
  }
}
