import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Doctor, EmployeeDropdown } from '../interfaces/doctormanagement';
import { Table } from 'primeng/table';

@Injectable({
  providedIn: 'root',
})
export class DoctormanagementService {
  private apiUrl = environment.apiUrl + 'DoctorManagement';
  http = inject(HttpClient);
  constructor() {}

  getDoctors() {
    return this.http.get<Doctor[]>(`${this.apiUrl}/AllDoctors`);
  }

  registerDoctor(doctor: Doctor) {
    return this.http.post(`${this.apiUrl}/register`, doctor);
  }

  employeeDropdown() {
    return this.http.get<EmployeeDropdown[]>(`${this.apiUrl}/EmpDropdown`);
  }
}
