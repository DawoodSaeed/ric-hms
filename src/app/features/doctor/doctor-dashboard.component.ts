// src/app/features/doctor/doctor-dashboard.component.ts
import { Component } from '@angular/core';
import { DoctormanagementService } from '../../core/services/doctormanagement.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  template: `<h1>Doctor Dashboard</h1>`,
})
export class DoctorDashboardComponent {
  constructor(private doctorService: DoctormanagementService) {}

  ngOnInit() {
    this.doctorService.getDoctors().subscribe((doctors) => {
      console.log(doctors);
    });
  }
}
