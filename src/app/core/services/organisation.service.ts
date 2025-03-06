import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { Department, SubDepartment, Service } from '../interfaces/organisation';
import { environment } from '../../../environments/environment.development';
import { SubSpeciality } from '../interfaces/typetable';
@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  private baseUrl = `${environment.apiUrl}Organisation`;

  constructor(private http: HttpClient) {}
  private departmentID$ = new BehaviorSubject<number | null>(null);
  private subDepartments$ = new BehaviorSubject<SubDepartment[]>([]);
  setDepartmentID(departmentID: number) {
    console.log('Department ID coming:', departmentID);
    this.departmentID$.next(departmentID); // Push new department ID
  }
  // Departments
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/AllDepartments`).pipe(
      map((departments) =>
        departments.map(dept => ({
          ...dept,   // Spread existing properties
          id: dept.did  // Add new property 'id'
        }))
      )
    );
  }
  createOrUpdateDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(
      `${this.baseUrl}/CreateOrUpdateDepartment`,
      department
    );
  }
  // Sub-Departments
  getAllSubDepartments(): Observable<SubDepartment[]> {
    this.http.get<SubDepartment[]>(`${this.baseUrl}/AllSubDepartments`).pipe(
      map((subDepts) =>
        subDepts.map(subDept => ({
          ...subDept,
          id: subDept.subDid // Add 'id' property
        }))
      )
    ).subscribe((subDepts) => {
      this.subDepartments$.next(subDepts); // Push all subDepartments into BehaviorSubject
    });
  
    return this.departmentID$.pipe(
      switchMap((departmentID) => {
        if (!departmentID) return of([]);
        return this.subDepartments$.pipe(
          map((subDepts) =>{

            console.log('subDeptsx ',subDepts)
            return subDepts.filter(subDept => subDept.did
              === departmentID)
          }
          )
        );
      })
    );
  }
  createOrUpdateSubDepartment(
    subDepartment: SubDepartment
  ): Observable<SubDepartment> {
    return this.http.post<SubDepartment>(
      `${this.baseUrl}/CreateOrUpdateSubDepartment`,
      subDepartment
    );
  }
  // Services
  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.baseUrl}/AllServices`);
  }
  createOrUpdateService(service: Service): Observable<Service> {
    return this.http.post<Service>(
      `${this.baseUrl}/CreateOrUpdateService`,
      service
    );
  }
}
