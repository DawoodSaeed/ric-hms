import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Signal } from '@angular/core';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private authService:AuthService) {
    this.authService.loggedInUserId$.subscribe(userId=>{
      console.log('hehe111 ',userId)
      if(userId){

        this.defaultObj.createdById=Number(userId)
      }
    })
  }
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'Employee';
  employee$ = this.http.get<Employee[]>(`${this.apiUrl}`);
  private employeeAwardSubject = new BehaviorSubject<any[]>([]);
  employeeAwards$ = this.employeeAwardSubject.asObservable();
  private bankDetailsSubject = new BehaviorSubject<any[]>([]);
  bankDetails$ = this.bankDetailsSubject.asObservable();
  private educationSubject = new BehaviorSubject<any[]>([]);
  education$ = this.educationSubject.asObservable();
  private departmentSubject = new BehaviorSubject<any[]>([]);
  department$ = this.departmentSubject.asObservable();
  private subDepartmentSubject = new BehaviorSubject<any[]>([]);
  subDepartment$ = this.subDepartmentSubject.asObservable();
  private designationSubject = new BehaviorSubject<any[]>([]);
  designation$ = this.designationSubject.asObservable();
  private experienceSubject = new BehaviorSubject<any[]>([]);
  experience$ = this.experienceSubject.asObservable();
  private facilitySubject = new BehaviorSubject<any[]>([]);
  facility$ = this.facilitySubject.asObservable();
  private specialitySubject = new BehaviorSubject<any[]>([]);
  speciality$ = this.specialitySubject.asObservable();
  private subSpecialitySubject = new BehaviorSubject<any[]>([]);
  subSpeciality$ = this.subSpecialitySubject.asObservable();
registeredEmpIDSignal=signal<number|null>(null)
defaultObj={
  createdById: 0,
  createdOn: new Date().toISOString(),
}
  
  registerEmployee = (employee: Employee): Observable<any> => {
    console.log(employee);
    employee = { ...employee, empId: 0 };
    return this.http.post<{message:string;empid:number;}>(`${this.apiUrl}/register`, employee).pipe(
      tap((response)=>{
        
if(response?.empid){
  this.registeredEmpIDSignal.set(response.empid)

}
      })
    );
  };

  addEmployeeAwardDetails = (awardDetails: EmployeeAward): Observable<any> => {
    awardDetails={...awardDetails,...this.defaultObj,empAwrdId:0}
    return this.http.post(`${this.apiUrl}/empaward`, awardDetails).pipe(
      tap(() => this.getEmployeeAwardDetails())
    );
  };
  getEmployeeAwardDetails = (): void => {
    this.http.get(`${this.apiUrl}/empaward`).subscribe((data: any) =>
      this.employeeAwardSubject.next(data)
    );
  };

  addEmployeeBankDetails = (bankDetails: EmployeeBankDetails): Observable<any> => {
    bankDetails={...bankDetails,...this.defaultObj}

    return this.http.post(`${this.apiUrl}/empbank`, bankDetails).pipe(
      tap(() => this.getEmployeeBankDetails())
    );
  };
  getEmployeeBankDetails = (): void => {
    this.http.get(`${this.apiUrl}/empbank`).subscribe((data: any) =>
      this.bankDetailsSubject.next(data)
    );
  };

  addEmployeeEducationDetails = (educationDetails: EmployeeEducation): Observable<any> => {
    educationDetails={...educationDetails,...this.defaultObj}

    return this.http.post(`${this.apiUrl}/empeducation`, educationDetails).pipe(
      tap(() => this.getEmployeeEducationDetails())
    );
  };
  getEmployeeEducationDetails = (): void => {
    
    this.http.get(`${this.apiUrl}/empeducation`).subscribe((data: any) =>{
console.log('education data ',data)
      this.educationSubject.next(data)
    }
    );
  };

  addEmployeeDepartmentDetails = (departmentDetails: EmployeeDepartment): Observable<any> => {
    departmentDetails={...departmentDetails,...this.defaultObj}

    return this.http.post(`${this.apiUrl}/empdept`, departmentDetails).pipe(
      tap(() => this.getEmployeeDepartmentDetails())
    );
  };
  getEmployeeDepartmentDetails = (): void => {
    this.http.get(`${this.apiUrl}/empdept`).subscribe((data: any) =>
      this.departmentSubject.next(data)
    );
  };

  addEmployeesubDepartmentDetails = (subDeptDetails: EmployeeSubDepartment): Observable<any> => {
    subDeptDetails={...subDeptDetails,...this.defaultObj}

    return this.http.post(`${this.apiUrl}/empsubdept`, subDeptDetails).pipe(
      tap(() => this.getEmployeeSubDepartmentDetails())
    );
  };
  getEmployeeSubDepartmentDetails = (): void => {
    this.http.get(`${this.apiUrl}/empsubdept`).subscribe((data: any) =>
      this.subDepartmentSubject.next(data)
    );
  };

  addEmployeeDesignationDetails = (designationDetails: EmployeeDesignation): Observable<any> => {
    designationDetails={...designationDetails,...this.defaultObj}

    return this.http.post(`${this.apiUrl}/empdesg`, designationDetails).pipe(
      tap(() => this.getEmployeeDesignationDetails())
    );
  };
  getEmployeeDesignationDetails = (): void => {
    this.http.get(`${this.apiUrl}/empdesg`).subscribe((data: any) =>
      this.designationSubject.next(data)
    );
  };

  addEmployeeExpDetails = (expDetails: EmployeeExperience): Observable<any> => {
    expDetails={...expDetails,...this.defaultObj}

    return this.http.post(`${this.apiUrl}/empexperience`, expDetails).pipe(
      tap(() => this.getEmployeeExperienceDetails())
    );
  };
  getEmployeeExperienceDetails = (): void => {
    this.http.get(`${this.apiUrl}/empexperience`).subscribe((data: any) =>
      this.experienceSubject.next(data)
    );
  };

  addEmployeeFacilityDetails = (facilityDetails: EmployeeFacility): Observable<any> => {
    facilityDetails={...facilityDetails,...this.defaultObj}

    return this.http.post(`${this.apiUrl}/empfacility`, facilityDetails).pipe(
      tap(() => this.getEmployeeFacilityDetails())
    );
  };
  getEmployeeFacilityDetails = (): void => {
    this.http.get(`${this.apiUrl}/empfacility`).subscribe((data: any) =>
      this.facilitySubject.next(data)
    );
  };

  addEmployeeSpecialityDetails = (specialityDetails: EmployeeSpecialization): Observable<any> => {
    specialityDetails={...specialityDetails,...this.defaultObj}

    return this.http.post(`${this.apiUrl}/empspeciality`, specialityDetails).pipe(
      tap(() => this.getEmployeeSpecialityDetails())
    );
  };
  getEmployeeSpecialityDetails = (): void => {
    this.http.get(`${this.apiUrl}/empspeciality`).subscribe((data: any) =>
      this.specialitySubject.next(data)
    );
  };

  addEmployeeSubSpecialityDetails = (subSpecialityDetails: EmployeeSubSpecialization): Observable<any> => {
    subSpecialityDetails={...subSpecialityDetails,...this.defaultObj}

    return this.http.post(`${this.apiUrl}/empsubspeciality`, subSpecialityDetails).pipe(
      tap(() => this.getEmployeeSubSpecialityDetails())
    );
  };
  getEmployeeSubSpecialityDetails = (): void => {
    this.http.get(`${this.apiUrl}/empsubspeciality`).subscribe((data: any) =>
      this.subSpecialitySubject.next(data)
    );
  };
}
