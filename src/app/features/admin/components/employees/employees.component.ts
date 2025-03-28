import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { combineLatest, forkJoin, map, Subscription, switchMap, take, timer } from 'rxjs';
import { TabViewModule } from 'primeng/tabview'; // For the tabs
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { ConfirmDialog } from 'primeng/confirmdialog';

import {
  Building,
  Floor,
  Room,
} from '../../../../core/interfaces/branch.interface';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';

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
    ConfirmDialog
  ],
  providers: [MessageService,ConfirmationService],
})
export class EmployeesComponent {
  private employeeService = inject(EmployeeService);
  @Input() data!: Bank[] | Building[] | Room[] | Floor[];
  employees = signal<Employee[]>([]);
  cols = signal<cols[]>([]);
  selectedEmployee: Employee | null = null;
  cachedEmployeeData: { [empId: string]: Employee } = {};
subscriptions:Subscription=new Subscription()
  // employees$ =
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
  employeeToDelete: any;
  cachedempId: number|null=null;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private cdr:ChangeDetectorRef,
        private notificationService: NotificationService,
    
    public confirmationService: ConfirmationService
  ) {
  const employeeSub=  this.employeeService.employee$
      .subscribe({
        next: (data: Employee[]) => {
          console.log(data.length);
          console.log('employee data ',data)
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
          console.log('this.employees ',this.employees())
          this.loading.set(false);
        },
      });
      this.subscriptions.add(employeeSub)
  }

  rowNumbers(rows: number): number[] {
    return Array.from({ length: rows }, (_, i) => i + 1);
  }
  editRow(employee: any) {
    console.log('Editing Employee:', employee);

    this.employeeService.setRegisteredEmpID(employee.empId);

    this.router.navigate(['admin/addEmployee'], {
      state: { employee, isEdit: true },
    });
  }
  showDetails(employee: Employee | null) {
    if (employee) {
      console.log('employee.empId ',employee.empId,' this.cachedempId',this.cachedempId);
      this.employeeSidebarVisible = true;
      if(this.cachedempId===employee.empId){
        return
      }
      this.cachedempId=employee.empId
      this.employeeService.setRegisteredEmpID(employee.empId);
      // Call all APIs first
      this.employeeService.getEmployeeAwardDetails();
      this.employeeService.getEmployeeBankDetails();
      this.employeeService.getEmployeeEducationDetails();
      this.employeeService.getEmployeeDepartmentDetails();
      this.employeeService.getEmployeeSubDepartmentDetails();
      this.employeeService.getEmployeeDesignationDetails();
      this.employeeService.getEmployeeExperienceDetails();
      this.employeeService.getEmployeeFacilityDetails();
      this.employeeService.getEmployeeSpecialityDetails();
      this.employeeService.getEmployeeSubSpecialityDetails();
      // Small delay to ensure API calls are made
   const combineSub=   timer(300)
        .pipe(
          switchMap(() =>
            combineLatest([
              this.employeeService.employeeAwards$,
              this.employeeService.bankDetails$,
              this.employeeService.education$,
              this.employeeService.department$,
              this.employeeService.subDepartment$,
              this.employeeService.designation$,
              this.employeeService.experience$,
              this.employeeService.facility$,
              this.employeeService.speciality$,
              this.employeeService.subSpeciality$,
            ])
          )
        )
        .subscribe(
          ([
            awards,
            bankDetails,
            education,
            department,
            subDepartment,
            designation,
            experience,
            facility,
            speciality,
            subSpeciality,
          ]) => {
            console.log('All Data:', {
              awards,
              bankDetails,
              education,
              department,
              subDepartment,
              designation,
              experience,
              facility,
              speciality,
              subSpeciality,
            });
  
            employee = {
              ...employee,
              awardData: awards,
              bankDetails: bankDetails,
              educationData: education,
              department: department,
              subDepartmentData: subDepartment,
              designationData: designation,
              experienceData: experience,
              facilityData: facility,
              specialityData: speciality,
              subSpecialityData: subSpeciality,
            } as Employee;
  
            console.log('Final Employee:', employee);

            this.selectedEmployee = employee;
  this.cdr.detectChanges()
          }
        );
        this.subscriptions.add(combineSub)
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
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editRow(employee),
      },

      {
        icon: 'pi pi-refresh',
        command: () => {
          console.log('Clicked');
          // this.showDetails(this.selectedEmployee);
        },

        label: 'Refresh Employee',
      },
      // {
      //   icon: 'pi pi-trash',
      //   command: () => {
      //     console.log('Deleteing now');
      //     this.employeeToDelete=employee
      //     this.deleteEmployee(employee);
      //   },

      //   label: 'Delete Employee',
      // },
    ]);
  }

  viewEmployee(employee: any) {
    this.showDetails(employee);
  }

  
  // deleteEmployee(employee: any) {
  //   console.log('Deleting', employee);
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete this item?',
  //     header: 'Confirm Deletion',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.confirmDeletion()
  //     },
  //     reject: () => {
  //       this.confirmationService.close();
  //       console.log('Action canceled.');
  //       return;
  //     },
  //   });
  // }
confirmDeletion(){
  this.employeeService.setRegisteredEmpID(this.employeeToDelete.empId);
  const deleteSub=this.employeeService.registerEmployee(this.employeeToDelete, false, true).subscribe({
    next:(response)=>{
      if(response){
        this.notificationService.showSuccess('Employee Deleted Successfully!');

      }
    },
    error:(err)=>{
      this.notificationService.showError('Error!Employee could not be deleted');
    },
    complete:()=>{

    }
  });
  this.confirmationService.close()
  this.subscriptions.add(deleteSub)
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

  ngOnDestroy(){
    console.log('Destroying subs ')
    console.log(this.subscriptions)
    this.subscriptions.unsubscribe()
  }
}
