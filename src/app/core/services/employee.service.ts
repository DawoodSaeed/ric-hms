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
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Signal } from '@angular/core';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private authService: AuthService) {
    this.authService.loggedInUserId$.subscribe((userId) => {
      console.log('hehe111 ', userId);
      if (userId) {
        this.defaultObj.createdById = Number(userId);
      }
    });
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
  registeredEmpIDSignal = signal<number | null>(null);
  defaultObj = {
    empId: this.registeredEmpIDSignal() ?? 0,
    createdById: 0,
    createdOn: new Date().toISOString(),
  };

  registerEmployee = (employee: Employee): Observable<any> => {
    console.log(employee);
    employee = { ...employee, empId: 0 };
    return this.http
      .post<{ message: string; empid: number }>(
        `${this.apiUrl}/register`,
        employee
      )
      .pipe(
        tap((response) => {
          if (response?.empid) {
            this.registeredEmpIDSignal.set(response.empid);
            this.defaultObj.empId = response.empid;
          } else {
            this.registeredEmpIDSignal.set(null);
            // this.defaultObj.empId = response.empid;
          }
        })
      );
  };

  addEmployeeAwardDetails = (
    awardDetails: EmployeeAward,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
     awardDetails.status=0
     awardDetails.empId=this.defaultObj.empId
    } else {
      if (isEdit) {
        awardDetails = {
          ...awardDetails,
          empId: this.defaultObj.empId,
          modifiedById: this.defaultObj.createdById,
          status,
          modifiedOn: new Date().toISOString(),
        };
        delete awardDetails.createdOn;
        delete awardDetails.createdById;
      } else {
        let empAwrdId = 0;
        awardDetails = {
          ...awardDetails,
          ...this.defaultObj,
          empAwrdId,
          status,
        };
      }
    }
    
    console.log('final award ', awardDetails);
    return this.http
      .post(`${this.apiUrl}/empaward`, awardDetails)
      .pipe(tap(() => this.getEmployeeAwardDetails()));
  };
  getEmployeeAwardDetails = (): void => {
    this.http
      .get(`${this.apiUrl}/empaward`)
      .pipe(
        map((response: any) => {
          return response.filter((data: any) => data.status === 1);
        })
      )
      .subscribe((data: any) => this.employeeAwardSubject.next(data));
  };

  // addEmployeeBankDetails = (
  //   bankDetails: EmployeeBankDetails
  // ): Observable<any> => {
  //   bankDetails = { ...bankDetails, ...this.defaultObj, empBankId: 0 };

  //   return this.http
  //     .post(`${this.apiUrl}/empbank`, bankDetails)
  //     .pipe(tap(() => this.getEmployeeBankDetails()));
  // };
  addEmployeeBankDetails = (
    bankDetails: EmployeeBankDetails,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      bankDetails.status = 0;
      bankDetails.empId = this.defaultObj.empId;
    } else if (isEdit) {
      bankDetails = {
        ...bankDetails,
        empId: this.defaultObj.empId,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete bankDetails.createdOn;
      delete bankDetails.createdById;
    } else {
      bankDetails = { ...bankDetails, ...this.defaultObj, empBankId: 0, status };
    }

    return this.http
      .post(`${this.apiUrl}/empbank`, bankDetails)
      .pipe(tap(() => this.getEmployeeBankDetails()));
  };
  getEmployeeBankDetails = (): void => {
    this.http
      .get(`${this.apiUrl}/empbank`)
      .subscribe((data: any) => this.bankDetailsSubject.next(data));
  };

  // addEmployeeEducationDetails = (
  //   educationDetails: EmployeeEducation
  // ): Observable<any> => {
  //   educationDetails = { ...educationDetails, ...this.defaultObj, empEduId: 0 };

  //   return this.http
  //     .post(`${this.apiUrl}/empeducation`, educationDetails)
  //     .pipe(tap(() => this.getEmployeeEducationDetails()));
  // };

 
  addEmployeeEducationDetails = (
    educationDetails: EmployeeEducation,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      educationDetails.status = 0;
      educationDetails.empId = this.defaultObj.empId;
    } else if (isEdit) {
      educationDetails = {
        ...educationDetails,
        empId: this.defaultObj.empId,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete educationDetails.createdOn;
      delete educationDetails.createdById;
    } else {
      educationDetails = { ...educationDetails, ...this.defaultObj, empEduId: 0, status };
    }

    return this.http
      .post(`${this.apiUrl}/empeducation`, educationDetails)
      .pipe(tap(() => this.getEmployeeEducationDetails()));
  };
  getEmployeeEducationDetails = (): void => {
    this.http.get(`${this.apiUrl}/empeducation`).subscribe((data: any) => {
      console.log('education data ', data);
      this.educationSubject.next(data);
    });
  };

  addEmployeeDepartmentDetails = (
    departmentDetails: EmployeeDepartment,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      departmentDetails.status = 0;
      departmentDetails.empId = this.defaultObj.empId;
    } else if (isEdit) {
      departmentDetails = {
        ...departmentDetails,
        empId: this.defaultObj.empId,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete departmentDetails.createdOn;
      delete departmentDetails.createdById;
    } else {
      departmentDetails = { ...departmentDetails, ...this.defaultObj, empDid: 0, status };
    }

    return this.http
      .post(`${this.apiUrl}/empdept`, departmentDetails)
      .pipe(tap(() => this.getEmployeeDepartmentDetails()));
  };
  getEmployeeDepartmentDetails = (): void => {
    this.http
      .get(`${this.apiUrl}/empdept`)
      .subscribe((data: any) => this.departmentSubject.next(data));
  };

  // addEmployeesubDepartmentDetails = (
  //   subDeptDetails: EmployeeSubDepartment
  // ): Observable<any> => {
  //   subDeptDetails = { ...subDeptDetails, ...this.defaultObj, empSubDid: 0 };

  //   return this.http
  //     .post(`${this.apiUrl}/empsubdept`, subDeptDetails)
  //     .pipe(tap(() => this.getEmployeeSubDepartmentDetails()));
  // };
  addEmployeesubDepartmentDetails = (
    subDeptDetails: EmployeeSubDepartment,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      subDeptDetails.status = 0;
      subDeptDetails.empId = this.defaultObj.empId;
    } else if (isEdit) {
      subDeptDetails = {
        ...subDeptDetails,
        empId: this.defaultObj.empId,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete subDeptDetails.createdOn;
      delete subDeptDetails.createdById;
    } else {
      subDeptDetails = {
        ...subDeptDetails,
        ...this.defaultObj,
        empSubDid: 0,
        status,
      };
    }
  
    return this.http
      .post(`${this.apiUrl}/empsubdept`, subDeptDetails)
      .pipe(tap(() => this.getEmployeeSubDepartmentDetails()));
  };
  
  getEmployeeSubDepartmentDetails = (): void => {
    this.http
      .get(`${this.apiUrl}/empsubdept`)
      .subscribe((data: any) => this.subDepartmentSubject.next(data));
  };

  // addEmployeeDesignationDetails = (
  //   designationDetails: EmployeeDesignation
  // ): Observable<any> => {
  //   designationDetails = {
  //     ...designationDetails,
  //     ...this.defaultObj,
  //     empDesgnId: 0,
  //   };

  //   return this.http
  //     .post(`${this.apiUrl}/empdesg`, designationDetails)
  //     .pipe(tap(() => this.getEmployeeDesignationDetails()));
  // };
  addEmployeeDesignationDetails = (
    designationDetails: EmployeeDesignation,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      designationDetails.status = 0;
      designationDetails.empId = this.defaultObj.empId;
    } else if (isEdit) {
      designationDetails = {
        ...designationDetails,
        empId: this.defaultObj.empId,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete designationDetails.createdOn;
      delete designationDetails.createdById;
    } else {
      designationDetails = {
        ...designationDetails,
        ...this.defaultObj,
        empDesgnId: 0,
        status,
      };
    }
  
    return this.http
      .post(`${this.apiUrl}/empdesg`, designationDetails)
      .pipe(tap(() => this.getEmployeeDesignationDetails()));
  };
  
  getEmployeeDesignationDetails = (): void => {
    this.http
      .get(`${this.apiUrl}/empdesg`)
      .subscribe((data: any) => this.designationSubject.next(data));
  };

  // addEmployeeExpDetails = (expDetails: EmployeeExperience): Observable<any> => {
  //   expDetails = { ...expDetails, ...this.defaultObj, empExpId: 0 };

  //   return this.http
  //     .post(`${this.apiUrl}/empexperience`, expDetails)
  //     .pipe(tap(() => this.getEmployeeExperienceDetails()));
  // };

  addEmployeeExpDetails = (
    expDetails: EmployeeExperience,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      expDetails.status = 0;
      expDetails.empId = this.defaultObj.empId;
    } else if (isEdit) {
      expDetails = {
        ...expDetails,
        empId: this.defaultObj.empId,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete expDetails.createdOn;
      delete expDetails.createdById;
    } else {
      expDetails = {
        ...expDetails,
        ...this.defaultObj,
        empExpId: 0,
        status,
      };
    }
  
    return this.http
      .post(`${this.apiUrl}/empexperience`, expDetails)
      .pipe(tap(() => this.getEmployeeExperienceDetails()));
  };
  

  getEmployeeExperienceDetails = (): void => {
    this.http
      .get(`${this.apiUrl}/empexperience`)
      .subscribe((data: any) => this.experienceSubject.next(data));
  };

  // addEmployeeFacilityDetails = (
  //   facilityDetails: EmployeeFacility
  // ): Observable<any> => {
  //   facilityDetails = {
  //     ...facilityDetails,
  //     ...this.defaultObj,
  //     empFacilityId: 0,
  //   };

  //   return this.http
  //     .post(`${this.apiUrl}/empfacility`, facilityDetails)
  //     .pipe(tap(() => this.getEmployeeFacilityDetails()));
  // };
  addEmployeeFacilityDetails = (
    facilityDetails: EmployeeFacility,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      facilityDetails.status = 0;
      facilityDetails.empId = this.defaultObj.empId;
    } else if (isEdit) {
      facilityDetails = {
        ...facilityDetails,
        empId: this.defaultObj.empId,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete facilityDetails.createdOn;
      delete facilityDetails.createdById;
    } else {
      facilityDetails = {
        ...facilityDetails,
        ...this.defaultObj,
        empFacilityId: 0,
        status,
      };
    }
  
    return this.http
      .post(`${this.apiUrl}/empfacility`, facilityDetails)
      .pipe(tap(() => this.getEmployeeFacilityDetails()));
  };
  
  getEmployeeFacilityDetails = (): void => {
    this.http
      .get(`${this.apiUrl}/empfacility`)
      .subscribe((data: any) => this.facilitySubject.next(data));
  };

  // addEmployeeSpecialityDetails = (
  //   specialityDetails: EmployeeSpecialization
  // ): Observable<any> => {
  //   specialityDetails = {
  //     ...specialityDetails,
  //     ...this.defaultObj,
  //     empSpId: 0,
  //   };

  //   return this.http
  //     .post(`${this.apiUrl}/empspeciality`, specialityDetails)
  //     .pipe(tap(() => this.getEmployeeSpecialityDetails()));
  // };
  addEmployeeSpecialityDetails = (
    specialityDetails: EmployeeSpecialization,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      specialityDetails.status = 0;
      specialityDetails.empId = this.defaultObj.empId;
    } else if (isEdit) {
      specialityDetails = {
        ...specialityDetails,
        empId: this.defaultObj.empId,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete specialityDetails.createdOn;
      delete specialityDetails.createdById;
    } else {
      specialityDetails = {
        ...specialityDetails,
        ...this.defaultObj,
        empSpId: 0,
        status,
      };
    }
  
    return this.http
      .post(`${this.apiUrl}/empspeciality`, specialityDetails)
      .pipe(tap(() => this.getEmployeeSpecialityDetails()));
  };
  
  getEmployeeSpecialityDetails = (): void => {
    this.http
      .get(`${this.apiUrl}/empspeciality`)
      .subscribe((data: any) => this.specialitySubject.next(data));
  };

  // addEmployeeSubSpecialityDetails = (
  //   subSpecialityDetails: EmployeeSubSpecialization
  // ): Observable<any> => {
  //   subSpecialityDetails = {
  //     ...subSpecialityDetails,
  //     ...this.defaultObj,
  //     empSubSpId: 0,
  //   };

  //   return this.http
  //     .post(`${this.apiUrl}/empsubspeciality`, subSpecialityDetails)
  //     .pipe(tap(() => this.getEmployeeSubSpecialityDetails()));
  // };
  addEmployeeSubSpecialityDetails = (
    subSpecialityDetails: EmployeeSubSpecialization,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      subSpecialityDetails.status = 0;
      subSpecialityDetails.empId = this.defaultObj.empId;
    } else if (isEdit) {
      subSpecialityDetails = {
        ...subSpecialityDetails,
        empId: this.defaultObj.empId,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete subSpecialityDetails.createdOn;
      delete subSpecialityDetails.createdById;
    } else {
      subSpecialityDetails = {
        ...subSpecialityDetails,
        ...this.defaultObj,
        empSubSpId: 0,
        status,
      };
    }
  
    return this.http
      .post(`${this.apiUrl}/empsubspeciality`, subSpecialityDetails)
      .pipe(tap(() => this.getEmployeeSubSpecialityDetails()));
  };
  
  getEmployeeSubSpecialityDetails = (): void => {
    this.http
      .get(`${this.apiUrl}/empsubspeciality`)
      .subscribe((data: any) => this.subSpecialitySubject.next(data));
  };
}
