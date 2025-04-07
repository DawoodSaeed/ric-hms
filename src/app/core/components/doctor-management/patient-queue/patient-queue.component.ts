import { Component, inject } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { PatientQueueService } from '../../../services/patient-queue.service';

@Component({
  selector: 'app-patient-queue',
  imports: [
    TabViewModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    BreadcrumbComponent,
  ],
  templateUrl: './patient-queue.component.html',
  styleUrl: './patient-queue.component.scss',
})
export class PatientQueueComponent {
  patientQueue = inject(PatientQueueService);
  activeTab = 0;

  patients = [
    {
      name: 'Mr. Aamir (Regular)',
      mrNo: '0401-25-000012',
      visitNo: '250313-A001',
      waitingTime: '294:05:07',
      status: 'Walk-In',
      department: 'OPD',
    },
  ];

  constructor() {
    this.patientQueue
      .getPatientQueue({
        DeptID: 4,
        PatientCheckInStatus: 3,
      })
      .subscribe({
        next: (data) => console.log(data),
      });
  }
}
