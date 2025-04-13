import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TableModule } from 'primeng/table';

import {
  map,
  from,
  groupBy,
  mergeMap,
  switchMap,
  tap,
  toArray,
  filter,
  take,
  scheduled,
  catchError,
  of,
  reduce,
  bufferCount,
  scan,
} from 'rxjs';
import { RoasterService } from '../../../services/roaster.service';
import { RoasterSchedule } from '../../../interfaces/roaster.interface';
import { CommonModule } from '@angular/common';
import { Select } from 'primeng/select';
import { TypeTableService } from '../../../services/type-table.service';
import { NotificationService } from '../../../services/notification.service';
import { TimeShift } from '../../../interfaces/typetable';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';

interface Employee {
  empId: number;
  empName: string;
  cnic: string;
  schedules: RoasterSchedule[];
}

// Define interfaces for better type safety
interface RoasterScheduleItem {
  id: number;
  name: string | null;
  description: string | null;
  date: string; // Keep as string or use Date object if preferred
  rosterId: number;
  empId: number;
  timeShiftId: number | null;
  createdById: number;
  createdOn: string;
  modifiedById: number | null;
  modifiedOn: string | null;
  isActive: number;
  empName: string;
  cnic: string;
}

interface GroupedEmployeeSchedule {
  empId: number;
  empName: string;
  cnic: string;
  schedules: RoasterScheduleItem[]; // Array of schedules for this employee
}

@Component({
  selector: 'app-assign-staff',
  imports: [
    TableModule,
    CommonModule,
    Select,
    FormsModule,
    BreadcrumbComponent,
  ],
  templateUrl: './assign-staff.component.html',
  styleUrl: './assign-staff.component.scss',
})
export class AssignStaffComponent {
  private roasterService = inject(RoasterService);
  private typeTableService = inject(TypeTableService);
  private notifyService = inject(NotificationService);
  employees = signal<Employee[]>([]);
  countIteration = signal(0);
  timeShifts = signal<TimeShift[]>([]);

  constructor(private route: ActivatedRoute) {
    // this.route.params
    //   .pipe(
    //     tap((params) => console.log('Roaster ID:', params['roasterId'])),
    //     switchMap((params) =>
    //       this.roasterService.getAllRoasterSchedules(params['roasterId']).pipe(
    //         tap((schedules) => {
    //           console.log(schedules.length);
    //         }),
    //         catchError((err) => {
    //           console.error('Error fetching schedules:', err);
    //           return of([]); // Return an empty array to avoid breaking the stream
    //         })
    //       )
    //     ),
    //     mergeMap((schedules) => from(schedules || [])),
    //     groupBy((schedule) => schedule.empId),
    //     mergeMap((group$) =>
    //       group$.pipe(
    //         bufferCount(31),
    //         map((schedules) => ({
    //           empId: group$.key,
    //           empName: schedules[0].empName,
    //           cnic: schedules[0].cnic,
    //           schedules: schedules, // Attach the schedules array
    //         }))
    //       )
    //     ),
    //     tap(console.log),
    //     scan((acc: RoasterSchedule[], curr: RoasterSchedule) => {
    //       acc.push(curr);
    //       return acc;
    //     }, []),
    //     tap(console.log)
    //   )
    //   .subscribe({
    //     next: (value) => {
    //       this.employees.set(value);
    //       this.countIteration.update((prev) => prev + 1);
    //     },
    //     error: (err) => console.error('Error:', err),
    //     complete: () => {
    //       console.log('Complete');
    //       console.log(this.employees());
    //     },
    //   });
    this.typeTableService
      .getTimeShifts()
      .pipe(take(1))
      .subscribe({
        next: (value) => {
          this.timeShifts.set(value);
        },
        error: (err) => {
          console.error('Error fetching time shifts:', err);
          this.notifyService.showError('Error fetching time shifts:');
        },
      });

    this.route.params
      .pipe(
        switchMap((params) =>
          this.roasterService.getAllRoasterSchedules(params['roasterId']).pipe(
            catchError((err) => {
              console.error('Error fetching schedules:', err);
              return of([]); // fallback to empty list
            })
          )
        ),
        switchMap((schedules) => {
          console.log('Schedules received:', schedules.length);

          // Emits each schedule as an individual item, then completes
          return from(schedules).pipe(
            groupBy((schedule) => schedule.empId),
            mergeMap((group$) =>
              group$.pipe(
                toArray(), // Collect all items in this group
                map((schedules) => {
                  console.log('Group Array:', schedules); // ✅ This should now work
                  return {
                    empId: group$.key,
                    empName: schedules[0]?.empName ?? 'N/A',
                    cnic: schedules[0]?.cnic ?? 'N/A',
                    schedules,
                  };
                })
              )
            ),
            toArray(), // Optionally collect all grouped employees
            tap((finalGrouped) =>
              console.log('Final grouped result:', finalGrouped)
            )
          );
        })
      )
      .subscribe({
        next: (groupedEmployees) => {
          console.log('Final emitted result to subscriber:', groupedEmployees);
          this.employees.set(groupedEmployees);
        },
        error: (err) => console.error('Stream error:', err),
        complete: () => console.log('Stream completed'),
      });
  }

  getDaysInMonth(dateString: string): number {
    const date = new Date(dateString);

    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-based month (0 = January)

    // Create a Date object for the first day of the next month
    const nextMonth = new Date(year, month, 1);

    // Subtract one day to get the last day of the current month
    const lastDayOfMonth = new Date(nextMonth.getTime() - 1);

    // Return the day of the month (number of days)
    return lastDayOfMonth.getDate();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    // Format the date using toLocaleDateString
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
    });
  }

  shiftChange(timeshiftId: number, schedule: RoasterSchedule) {
    console.log('Selected Timeshift ID:', timeshiftId);
    console.log('Schedule:', schedule);

    schedule.timeShiftId = timeshiftId;
    console.log('Saving schedule:', schedule);
    this.roasterService.addRoasterSchedule(schedule).subscribe({
      next: (response) => {
        console.log('Schedule added successfully:', response);
        this.notifyService.showSuccess('Schedule added successfully.');
      },
      error: (error) => {
        console.error('Error adding schedule:', error);
        this.notifyService.showError('Error adding schedule.');
      },
    });
  }

  getUniqueScheduleDates(employees: any[]): string[] {
    const uniqueDates = new Set<string>();
    employees.forEach((employee) => {
      employee.schedules.forEach((schedule: any) => {
        uniqueDates.add(schedule.date);
      });
    });
    return Array.from(uniqueDates).sort(); // Sort dates if needed
  }

  isWeekend(date: string): boolean {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 6 || dayOfWeek === 0; // 6 = Saturday, 0 = Sunday
  }
}
