import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DoctormanagementService {
  private apiUrl = environment.apiUrl + 'DoctorManagement';
  http = inject(HttpClient);
  constructor() {}

  getDoctors() {
    return this.http.get(`${this.apiUrl}/AllDoctors`);
  }

  // registerDoctor
}
