// typetable.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Bank,
  DepartmentCategory,
  DiscountType,
  EducationDegree,
  EducationInstitution,
  EmploymentStatus,
  Facility,
  FieldOfStudy,
  GuardianType,
  JobType,
  OrganizationType,
  PatientCheckInStatus,
  PatientType,
  PaymentMethod,
  Relation,
  Religion,
  Scale,
  TypeTable,
  WorkingSession,
} from '../interfaces/typetable';
@Injectable({
  providedIn: 'root',
})
export class TypeTableService {
  private apiUrl = '/api/TypeTables'; // Base API URL

  constructor(private http: HttpClient) {}

  // Generic GET All method
  getAll<T extends TypeTable>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${endpoint}/GetAll`);
  }

  // Generic POST Add/Update method
  addUpdate<T extends TypeTable>(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}/AddUpdate`, data);
  }

  // Special case for BloodGroup and GazzatedTypes GetAll (POST instead of GET)
  getAllPost<T extends TypeTable>(
    endpoint: string,
    data: any = {}
  ): Observable<T[]> {
    // Added optional data parameter
    return this.http.post<T[]>(`${this.apiUrl}/${endpoint}/GetAll`, data);
  }

  getBanks(): Observable<Bank[]> {
    return this.getAll<Bank>('Banks');
  }

  addUpdateBank(bank: Bank): Observable<Bank> {
    return this.addUpdate<Bank>('Banks', bank);
  }

  getBloodGroups(): Observable<TypeTable[]> {
    return this.getAllPost<TypeTable>('BloodGroup');
  }

  getGazzatedTypes(): Observable<TypeTable[]> {
    return this.getAllPost<TypeTable>('GazzatedTypes');
  }

  getChargesTypes(): Observable<TypeTable[]> {
    return this.getAll<TypeTable>('ChargesType');
  }

  addUpdateChargesType(chargesType: TypeTable): Observable<TypeTable> {
    return this.addUpdate<TypeTable>('ChargesType', chargesType);
  }

  getWorkingSessions(): Observable<WorkingSession[]> {
    return this.getAll<WorkingSession>('WorkingSessions');
  }

  addUpdateWorkingSession(
    workingSession: WorkingSession
  ): Observable<WorkingSession> {
    return this.addUpdate<WorkingSession>('WorkingSessions', workingSession);
  }

  getCheckInTypes(): Observable<TypeTable[]> {
    return this.getAll<TypeTable>('CheckInType');
  }

  addUpdateCheckInType(checkInType: TypeTable): Observable<TypeTable> {
    return this.addUpdate<TypeTable>('CheckInType', checkInType);
  }

  getDepartmentCategories(): Observable<DepartmentCategory[]> {
    return this.getAll<DepartmentCategory>('DepartmentCategories');
  }

  addUpdateDepartmentCategory(
    departmentCategory: DepartmentCategory
  ): Observable<DepartmentCategory> {
    return this.addUpdate<DepartmentCategory>(
      'DepartmentCategories',
      departmentCategory
    );
  }

  getDiscountTypes(): Observable<DiscountType[]> {
    return this.getAll<DiscountType>('DiscountTypes');
  }

  addUpdateDiscountType(discountType: DiscountType): Observable<DiscountType> {
    return this.addUpdate<DiscountType>('DiscountTypes', discountType);
  }

  getEducationDegrees(): Observable<EducationDegree[]> {
    return this.getAll<EducationDegree>('EducationDegrees');
  }

  addUpdateEducationDegree(
    educationDegree: EducationDegree
  ): Observable<EducationDegree> {
    return this.addUpdate<EducationDegree>('EducationDegrees', educationDegree);
  }

  getEducationInstitutions(): Observable<EducationInstitution[]> {
    return this.getAll<EducationInstitution>('EducationInstitutions');
  }

  addUpdateEducationInstitution(
    educationInstitution: EducationInstitution
  ): Observable<EducationInstitution> {
    return this.addUpdate<EducationInstitution>(
      'EducationInstitutions',
      educationInstitution
    );
  }

  getEmploymentStatuses(): Observable<EmploymentStatus[]> {
    return this.getAll<EmploymentStatus>('EmploymentStatus');
  }

  addUpdateEmploymentStatus(
    employmentStatus: EmploymentStatus
  ): Observable<EmploymentStatus> {
    return this.addUpdate<EmploymentStatus>(
      'EmploymentStatus',
      employmentStatus
    );
  }

  getFacilities(): Observable<Facility[]> {
    return this.getAll<Facility>('Facilities');
  }

  addUpdateFacility(facility: Facility): Observable<Facility> {
    return this.addUpdate<Facility>('Facilities', facility);
  }

  getFieldOfStudies(): Observable<FieldOfStudy[]> {
    return this.getAll<FieldOfStudy>('FieldofStudies');
  }

  addUpdateFieldOfStudy(fieldOfStudy: FieldOfStudy): Observable<FieldOfStudy> {
    return this.addUpdate<FieldOfStudy>('FieldofStudies', fieldOfStudy);
  }

  getGuardianTypes(): Observable<GuardianType[]> {
    return this.getAll<GuardianType>('GuardianTypes');
  }

  addUpdateGuardianType(guardianType: GuardianType): Observable<GuardianType> {
    return this.addUpdate<GuardianType>('GuardianTypes', guardianType);
  }

  getJobTypes(): Observable<JobType[]> {
    return this.getAll<JobType>('JobTypes');
  }

  addUpdateJobType(jobType: JobType): Observable<JobType> {
    return this.addUpdate<JobType>('JobTypes', jobType);
  }

  getOrganizationTypes(): Observable<OrganizationType[]> {
    return this.getAll<OrganizationType>('OrganizationTypes');
  }

  addUpdateOrganizationType(
    organizationType: OrganizationType
  ): Observable<OrganizationType> {
    return this.addUpdate<OrganizationType>(
      'OrganizationTypes',
      organizationType
    );
  }

  getPatientCheckInStatuses(): Observable<PatientCheckInStatus[]> {
    return this.getAllPost<PatientCheckInStatus>('PatientCheckInStatus'); // POST for GetAll
  }

  getPatientTypes(): Observable<PatientType[]> {
    return this.getAll<PatientType>('PatientTypes');
  }

  addUpdatePatientType(patientType: PatientType): Observable<PatientType> {
    return this.addUpdate<PatientType>('PatientTypes', patientType);
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.getAll<PaymentMethod>('PaymentMethods');
  }

  addUpdatePaymentMethod(
    paymentMethod: PaymentMethod
  ): Observable<PaymentMethod> {
    return this.addUpdate<PaymentMethod>('PaymentMethods', paymentMethod);
  }

  getRelations(): Observable<Relation[]> {
    return this.getAll<Relation>('Relations');
  }

  addUpdateRelation(relation: Relation): Observable<Relation> {
    return this.addUpdate<Relation>('Relations', relation);
  }

  getReligions(): Observable<Religion[]> {
    return this.getAll<Religion>('Religions');
  }

  addUpdateReligion(religion: Religion): Observable<Religion> {
    return this.addUpdate<Religion>('Religions', religion);
  }

  getScales(): Observable<Scale[]> {
    return this.getAll<Scale>('Scales');
  }

  addUpdateScale(scale: Scale): Observable<Scale> {
    return this.addUpdate<Scale>('Scales', scale);
  }
}
