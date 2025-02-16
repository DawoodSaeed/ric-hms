import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../shared/models/employee';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './admin-dashboard.component.scss',
  templateUrl: './admin-dashboard.component.html',
  imports: [CommonModule],
})
export class AdminDashboardComponent {
  private employeeService = inject(EmployeeService);

  employees = signal<Employee[]>([]);
  constructor() {
    this.employeeService.employee$.subscribe({
      next: (data: Employee[]) => {
        this.employees.set(data);
      },
    });
  }

  selectedEmployee: Employee | null = null; // For displaying details

  showDetails(employee: Employee) {
    this.selectedEmployee = employee;
  }

  closeDetails() {
    this.selectedEmployee = null;
  }

  // Helper function to format dates nicely (optional)
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }); // Customize format
  }
}
