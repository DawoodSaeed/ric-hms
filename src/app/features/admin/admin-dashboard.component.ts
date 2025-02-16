import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../shared/models/employee';

// PrimeNG Components
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { CustomSidebarComponent } from '../../core/components/custom-sidebar/custom-sidebar.component';
import { map } from 'rxjs';
import { TabViewModule } from 'primeng/tabview'; // For the tabs
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { SpeedDial } from 'primeng/speeddial';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './admin-dashboard.component.scss',
  templateUrl: './admin-dashboard.component.html',
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
  ],
  providers: [MessageService],
})
export class AdminDashboardComponent {
  private employeeService = inject(EmployeeService);

  employees = signal<Employee[]>([]);
  selectedEmployee: Employee | null = null;
  employeeSidebarVisible = false;

  constructor(private messageService: MessageService) {
    this.employeeService.employee$
      .pipe(map((employees) => employees.slice(0, 12)))
      .subscribe({
        next: (data: Employee[]) => {
          console.log(data.length);
          this.employees.set(data);
        },
      });
  }

  showDetails(employee: Employee) {
    this.selectedEmployee = employee;
    this.employeeSidebarVisible = true;
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

  getActionItems(employee: any) {
    return (this.items = [
      {
        icon: 'pi pi-view',
        command: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Add',
            detail: 'Data Added',
          });
        },
      },
      {
        icon: 'pi pi-refresh',
        command: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Update',
            detail: 'Data Updated',
          });
        },
      },
      {
        icon: 'pi pi-trash',
        command: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Delete',
            detail: 'Data Deleted',
          });
        },
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
}
