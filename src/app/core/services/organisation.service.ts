import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Department, SubDepartment, Service } from '../interfaces/organisation';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  private baseUrl = `${environment.apiUrl}Organisation`;

  constructor(private http: HttpClient) {}

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
    return this.http.get<SubDepartment[]>(`${this.baseUrl}/AllSubDepartments`).pipe(
      map((departments) =>
        departments.map(dept => ({
          ...dept,   // Spread existing properties
          id: dept.subDid  // Add new property 'id'
        }))
      )
    );;
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
