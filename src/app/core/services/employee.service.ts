import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Employee } from '../../shared/models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor() {}
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'Employee';

  employee$ = this.http.get<Employee[]>(`${this.apiUrl}`);

  registerEmployee(employee: Employee) {
    return this.http.post(`${this.apiUrl}/register`, employee);
  }
}
