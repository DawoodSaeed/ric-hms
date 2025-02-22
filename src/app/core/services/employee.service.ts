import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Employee } from '../../shared/models/employee';
import {
  EmployeeAward,
  EmployeeBankDetails,
  EmployeeDepartment,
  EmployeeDesignation,
  EmployeeEducation,
  EmployeeExperience,
  EmployeeFacility,
  EmployeeSpecialization,
  EmployeeSubDepartment,
  EmployeeSubSpecialization,
} from '../interfaces/employeeinterfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor() {}
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'Employee';

  employee$ = this.http.get<Employee[]>(`${this.apiUrl}`);

  registerEmployee=(employee: Employee): Observable<any>=> {
    console.log(employee);
    employee = { ...employee, empId: 0 };
    return this.http.post(`${this.apiUrl}/register`, employee);
  }

  addEmployeeAwardDetails=(awardDetails: EmployeeAward): Observable<any>=> {
    return this.http.post(`${this.apiUrl}/empaward`, awardDetails);
  }

  addEmployeeBankDetails=(bankDetails: EmployeeBankDetails): Observable<any>=> {
    return this.http.post(`${this.apiUrl}/empbank`, bankDetails);
  }

  addEmployeeEducationDetails=(educationDetails: EmployeeEducation): Observable<any>=> {
    return this.http.post(`${this.apiUrl}/empeducation`, educationDetails);
  }
  addEmployeeDepartmentDetails=(departmentDetails: EmployeeDepartment): Observable<any>=> {
    return this.http.post(`${this.apiUrl}/empdept`, departmentDetails);
  }
  addEmployeesubDepartmentDetails=(subDeptDetails: EmployeeSubDepartment): Observable<any>=> {
    return this.http.post(`${this.apiUrl}/empsubdept`, subDeptDetails);
  }
  addEmployeeDesignationDetails=(designationDetails: EmployeeDesignation): Observable<any>=> {
    return this.http.post(`${this.apiUrl}/empdesg`, designationDetails);
  }
  addEmployeeExpDetails=(expDetails: EmployeeExperience): Observable<any>=> {
    return this.http.post(`${this.apiUrl}/empexperience`, expDetails);
  }
  addEmployeeFacilityDetails=(facilityDetails: EmployeeFacility): Observable<any>=> {
    return this.http.post(`${this.apiUrl}/empfacility`, facilityDetails);
  }
  addEmployeeSpecialityDetails=(specialityDetails: EmployeeSpecialization): Observable<any>=> {
    return this.http.post(`${this.apiUrl}/empspeciality`, specialityDetails);
  }
  addEmployeeSubSpecialityDetails=(
    subSpecialityDetails: EmployeeSubSpecialization
  ): Observable<any>=> {
    return this.http.post(
      `${this.apiUrl}/empsubspeciality`,
      subSpecialityDetails
    );
  }
}
