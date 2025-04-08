import { HttpClient, HttpParams } from '@angular/common/http';
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
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';
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
    empId: this.registeredEmpIDSignal() ?? -5,
    createdById: 0,
    createdOn: this.formatDate(new Date().toISOString()),
  };

 
  formatDate(isoString: string) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0'); // Get the day

    return `${year}-${month}-${day}`;
  }

  setRegisteredEmpID(empID: number | null) {
    this.registeredEmpIDSignal.set(empID);
  }
  registerEmployee = (
    employee: Employee,
    isEdit: boolean = false,
    isDelete: boolean = false
  ): Observable<any> => {
    console.log(
      'register service employee ',
      employee,
      'isEdit value ',
      isEdit,
      'isDelte value ',
      isDelete
    );
    if (isDelete) {
      employee = {
        ...employee,
        empId: this.registeredEmpIDSignal() ?? -5,
      };
    } else if (isEdit) {
      console.log('updating employee...');
      employee = { ...employee, empId: this.registeredEmpIDSignal() ?? -5 };
    } else {
      employee = { ...employee, empId: 0 };
    }
    console.log('final employee data ', employee);
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
    console.log('getting awardDetails ',awardDetails);
    if (isDelete) {
      awardDetails.status = 0;
      awardDetails.empId = this.registeredEmpIDSignal() ?? -5;
    } else {
      if (isEdit) {
        awardDetails = {
          ...awardDetails,
          empId: this.registeredEmpIDSignal() ?? -5,
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
          empId: this.registeredEmpIDSignal() ?? -5,

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
    const params = new HttpParams().set(
      'empId',
      this.registeredEmpIDSignal() ?? -5
    );
    this.http
      .get(`${this.apiUrl}/empaward`, { params })
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
      bankDetails.empId = this.registeredEmpIDSignal() ?? -5;
    } else if (isEdit) {
      bankDetails = {
        ...bankDetails,
        empId: this.registeredEmpIDSignal() ?? -5,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete bankDetails.createdOn;
      delete bankDetails.createdById;
    } else {
      bankDetails = {
        ...bankDetails,
        ...this.defaultObj,
    empId: this.registeredEmpIDSignal() ?? -5,

        empBankId: 0,
        status,
      };
    }

    return this.http
      .post(`${this.apiUrl}/empbank`, bankDetails)
      .pipe(tap(() => this.getEmployeeBankDetails()));
  };
  getEmployeeBankDetails = (): void => {
    const params = new HttpParams().set('empId',  this.registeredEmpIDSignal() ?? -5);

    this.http
      .get(`${this.apiUrl}/empbank`, { params }).pipe(
        map((response: any) => {
          return response.filter((data: any) => data.status === 1);
        })
      )
      .subscribe((data: any) => this.bankDetailsSubject.next(data));
  };

  employeeBankDetails$ = this.http.get(`${this.apiUrl}/empbank`);



  addEmployeeEducationDetails = (
    educationDetails: EmployeeEducation,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    console.log('educationDetails ',educationDetails);
    if (isDelete) {
      educationDetails.status = 0;
      educationDetails.empId = this.registeredEmpIDSignal() ?? -5;
    } else if (isEdit) {
      educationDetails = {
        ...educationDetails,
        empId: this.registeredEmpIDSignal() ?? -5,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete educationDetails.createdOn;
      delete educationDetails.createdById;
    } else {
      educationDetails = {
        ...educationDetails,
        ...this.defaultObj,
    empId: this.registeredEmpIDSignal() ?? -5,

        empEduId: 0,
        status,
      };
    }

    return this.http
      .post(`${this.apiUrl}/empeducation`, educationDetails)
      .pipe(tap(() => this.getEmployeeEducationDetails()));
  };
  getEmployeeEducationDetails = (): void => {
    const params = new HttpParams().set('empId',  this.registeredEmpIDSignal() ?? -5);

    this.http
      .get(`${this.apiUrl}/empeducation`, { params }).pipe(
        map((response: any) => {
          return response.filter((data: any) => data.status === 1);
        })
      )
      .subscribe((data: any) => {
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
    console.log('getting departmentDetails ',departmentDetails);
    if (isDelete) {
      departmentDetails.status = 0;
      departmentDetails.empId = this.registeredEmpIDSignal() ?? -5;
    } else if (isEdit) {
      departmentDetails = {
        ...departmentDetails,
        empId:this.registeredEmpIDSignal() ?? -5,
        modifiedById: this.defaultObj.createdById,
        status,
        modifiedOn: new Date().toISOString(),
      };
      delete departmentDetails.createdOn;
      delete departmentDetails.createdById;
    } else {
      departmentDetails = {
        ...departmentDetails,
        ...this.defaultObj,
    empId: this.registeredEmpIDSignal() ?? -5,

        empDid: 0,
        status,
      };
    }

    return this.http
      .post(`${this.apiUrl}/empdept`, departmentDetails)
      .pipe(tap(() => this.getEmployeeDepartmentDetails()));
  };
  getEmployeeDepartmentDetails = (): void => {
    const params = new HttpParams().set('empId', this.registeredEmpIDSignal() ?? -5);

    this.http
      .get(`${this.apiUrl}/empdept`, { params }).pipe(
        map((response: any) => {
          return response.filter((data: any) => data.status === 1);
        })
      )
      .subscribe((data: any) => this.departmentSubject.next(data));
  };

  
  addEmployeesubDepartmentDetails = (
    subDeptDetails: EmployeeSubDepartment,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      subDeptDetails.status = 0;
      subDeptDetails.empId =  this.registeredEmpIDSignal() ?? -5;
    } else if (isEdit) {
      subDeptDetails = {
        ...subDeptDetails,
        empId: this.registeredEmpIDSignal() ?? -5,
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
    empId: this.registeredEmpIDSignal() ?? -5,

        empSubDid: 0,
        status,
      };
    }

    return this.http
      .post(`${this.apiUrl}/empsubdept`, subDeptDetails)
      .pipe(tap(() => this.getEmployeeSubDepartmentDetails()));
  };

  getEmployeeSubDepartmentDetails = (): void => {
    const params = new HttpParams().set('empId', this.registeredEmpIDSignal() ?? -5);

    this.http
      .get(`${this.apiUrl}/empsubdept`, { params }).pipe(
        map((response: any) => {
          return response.filter((data: any) => data.status === 1);
        })
      )
      .subscribe((data: any) => this.subDepartmentSubject.next(data));
  };

  addEmployeeDesignationDetails = (
    designationDetails: EmployeeDesignation,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      designationDetails.status = 0;
      designationDetails.empId = this.registeredEmpIDSignal() ?? -5;
    } else if (isEdit) {
      designationDetails = {
        ...designationDetails,
        empId: this.registeredEmpIDSignal() ?? -5,
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
    empId: this.registeredEmpIDSignal() ?? -5,

        empDesgnId: 0,
        status,
      };
    }

    return this.http
      .post(`${this.apiUrl}/empdesg`, designationDetails)
      .pipe(tap(() => this.getEmployeeDesignationDetails()));
  };

  getEmployeeDesignationDetails = (): void => {
    const params = new HttpParams().set('empId',  this.registeredEmpIDSignal() ?? -5);

    this.http
      .get(`${this.apiUrl}/empdesg`, { params }).pipe(
        map((response: any) => {
          return response.filter((data: any) => data.status === 1);
        })
      )
      .subscribe((data: any) => this.designationSubject.next(data));
  };



  addEmployeeExpDetails = (
    expDetails: EmployeeExperience,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      expDetails.status = 0;
      expDetails.empId = this.registeredEmpIDSignal() ?? -5;
    } else if (isEdit) {
      expDetails = {
        ...expDetails,
        empId:this.registeredEmpIDSignal() ?? -5,
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
    empId: this.registeredEmpIDSignal() ?? -5,

        empExpId: 0,
        status,
      };
    }

    return this.http
      .post(`${this.apiUrl}/empexperience`, expDetails)
      .pipe(tap(() => this.getEmployeeExperienceDetails()));
  };

  getEmployeeExperienceDetails = (): void => {
    const params = new HttpParams().set('empId',  this.registeredEmpIDSignal() ?? -5);

    this.http
      .get(`${this.apiUrl}/empexperience`, { params }).pipe(
        map((response: any) => {
          return response.filter((data: any) => data.status === 1);
        })
      )
      .subscribe((data: any) => this.experienceSubject.next(data));
  };


  addEmployeeFacilityDetails = (
    facilityDetails: EmployeeFacility,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    console.log('getting facilityDetails ',facilityDetails);
    if (isDelete) {
      facilityDetails.status = 0;
      facilityDetails.empId =  this.registeredEmpIDSignal() ?? -5;
    } else if (isEdit) {
      facilityDetails = {
        ...facilityDetails,
        empId: this.registeredEmpIDSignal() ?? -5,
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
    empId: this.registeredEmpIDSignal() ?? -5,

        empFacilityId: 0,
        status,
      };
    }
console.log('final facilityDetails ',facilityDetails);
    return this.http
      .post(`${this.apiUrl}/empfacility`, facilityDetails)
      .pipe(tap(() => this.getEmployeeFacilityDetails()));
  };

  getEmployeeFacilityDetails = (): void => {
    const params = new HttpParams().set('empId',  this.registeredEmpIDSignal() ?? -5);

    this.http
      .get(`${this.apiUrl}/empfacility`, { params }).pipe(
        map((response: any) => {
          return response.filter((data: any) => data.status === 1);
        })
      )
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
      specialityDetails.empId =  this.registeredEmpIDSignal() ?? -5;
    } else if (isEdit) {
      specialityDetails = {
        ...specialityDetails,
        empId:this.registeredEmpIDSignal() ?? -5,
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
    empId: this.registeredEmpIDSignal() ?? -5,

        empSpId: 0,
        status,
      };
    }

    return this.http
      .post(`${this.apiUrl}/empspeciality`, specialityDetails)
      .pipe(tap(() => this.getEmployeeSpecialityDetails()));
  };

  getEmployeeSpecialityDetails = (): void => {
    const params = new HttpParams().set('empId',  this.registeredEmpIDSignal() ?? -5);

    this.http
      .get(`${this.apiUrl}/empspeciality`, { params }).pipe(
        map((response: any) => {
          return response.filter((data: any) => data.status === 1);
        })
      )
      .subscribe((data: any) => this.specialitySubject.next(data));
  };

 
  addEmployeeSubSpecialityDetails = (
    subSpecialityDetails: EmployeeSubSpecialization,
    isEdit = false,
    isDelete = false,
    status: number = 1
  ): Observable<any> => {
    if (isDelete) {
      subSpecialityDetails.status = 0;
      subSpecialityDetails.empId =  this.registeredEmpIDSignal() ?? -5;
    } else if (isEdit) {
      subSpecialityDetails = {
        ...subSpecialityDetails,
        empId:this.registeredEmpIDSignal() ?? -5,
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
    empId: this.registeredEmpIDSignal() ?? -5,

        empSubSpId: 0,
        status,
      };
    }

    return this.http
      .post(`${this.apiUrl}/empsubspeciality`, subSpecialityDetails)
      .pipe(tap(() => this.getEmployeeSubSpecialityDetails()));
  };

  getEmployeeSubSpecialityDetails = (): void => {
    const params = new HttpParams().set('empId', this.registeredEmpIDSignal() ?? -5);

    this.http
      .get(`${this.apiUrl}/empsubspeciality`, { params }).pipe(
        map((response: any) => {
          return response.filter((data: any) => data.status === 1);
        })
      )
      .subscribe((data: any) => this.subSpecialitySubject.next(data));
  };
}
