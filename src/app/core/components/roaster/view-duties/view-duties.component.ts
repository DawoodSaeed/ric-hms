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
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';

interface Employee {
  empId: number;
  empName: string;
  cnic: string;
  schedules: RoasterSchedule[];
}
@Component({
  selector: 'app-view-duties',
  imports: [
    TableModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    BreadcrumbComponent,
    Select,
  ],
  templateUrl: './view-duties.component.html',
  styleUrl: './view-duties.component.scss',
})
export class ViewDutiesComponent {
  private roasterService = inject(RoasterService);
  private typeTableService = inject(TypeTableService);
  private notifyService = inject(NotificationService);
  employees = signal<Employee[]>([]);
  countIteration = signal(0);
  timeShifts = signal<TimeShift[]>([]);
  constructor(private route: ActivatedRoute) {
    this.route.params
      .pipe(
        tap((params) => console.log('Roaster ID:', params['roasterId'])),
        switchMap((params) =>
          this.roasterService.getAllRoasterSchedules(params['roasterId']).pipe(
            tap((schedules) => {
              console.log(schedules.length);
            }),
            catchError((err) => {
              console.error('Error fetching schedules:', err);
              return of([]); // Return an empty array to avoid breaking the stream
            })
          )
        ),
        mergeMap((schedules) => from(schedules || [])),
        groupBy((schedule) => schedule.empId),
        mergeMap((group$) =>
          group$.pipe(
            bufferCount(31),
            map((schedules) => ({
              empId: group$.key,
              empName: schedules[0].empName,
              cnic: schedules[0].cnic,
              schedules: schedules, // Attach the schedules array
            }))
          )
        ),
        tap(console.log),
        scan((acc: RoasterSchedule[], curr: RoasterSchedule) => {
          acc.push(curr);
          return acc;
        }, []),
        tap(console.log)
      )
      .subscribe({
        next: (value) => {
          if (this.countIteration() >= 14) {
            this.employees.set(value);
          }
          this.countIteration.update((prev) => prev + 1);
        },
        error: (err) => console.error('Error:', err),
        complete: () => {
          console.log('Complete');
          console.log(this.employees());
        },
      });

    // this.typeTableService
    //   .getTimeShifts()
    //   .pipe(take(1))
    //   .subscribe({
    //     next: (value) => {
    //       this.timeShifts.set(value);
    //     },
    //     error: (err) => {
    //       console.error('Error fetching time shifts:', err);
    //       this.notifyService.showError('Error fetching time shifts:');
    //     },
    //   });
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

  getShiftTime(timeShiftId: number): string {
    if (!timeShiftId || timeShiftId === 0) {
      return '-';
    }

    const shift = this.timeShifts().find((ts) => ts.id === timeShiftId);
    return shift ? shift.name : '-';
  }
}
