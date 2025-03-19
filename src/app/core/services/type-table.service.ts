import { PanelMenuModule } from 'primeng/panelmenu';
// typetable.service.ts

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';

import {
  Bank,
  City,
  Country,
  DepartmentCategory,
  Designation,
  DiscountType,
  District,
  EducationDegree,
  EducationInstitution,
  EmploymentStatus,
  Facility,
  FieldOfStudy,
  Grades,
  GuardianType,
  JobType,
  OrganizationType,
  PatientCheckInStatus,
  PatientType,
  PaymentMethod,
  Province,
  Relation,
  Religion,
  Scale,
  Speciality,
  SubSpeciality,
  TimeShift,
  TypeTable,
  WorkingSession,
} from '../interfaces/typetable';

import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class TypeTableService {
  private apiUrl = `${environment.apiUrl}TypeTables`; // Base API URL
  constructor(private http: HttpClient) {}
  private countryID$ = new BehaviorSubject<number | null>(1);
  private provinceID$ = new BehaviorSubject<number | null>(1);
  private specialityID$ = new BehaviorSubject<number | null>(null);
  private subSpecialities$ = new BehaviorSubject<SubSpeciality[]>([]);
  setSpecialityID(specialityID: number) {
    console.log('Speciality ID coming:', specialityID);
    this.specialityID$.next(specialityID); // Push new department ID
  }
  setCountryID(countryID: number) {
    console.log('countryid coming', countryID);
    this.countryID$.next(countryID);
  }
  setProvinceID(provinceID: number) {
    console.log('provinceid coming', provinceID);
    this.provinceID$.next(provinceID);
  }
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
    return this.getAll<TypeTable>('BloodGroup');
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
    return this.getAll<Religion>('Religions').pipe(
      map((religions) =>
        religions.map((religion) => ({
          ...religion,
          id: religion.name as unknown as number,
        }))
      )
    );
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

  // for the second push of the type table.... (Countries, Provinces, Dsitricts, Cities, designations ) ######

  // ###### COUNTRIES >>>>>>>>>>>>>
  getCountries(): Observable<Country[]> {
    return this.getAll<Country>('Countries').pipe(
      map((response: Country[]) =>
        response.filter((country: Country) => country.status === 1)
      ),
      catchError((error) => {
        console.log('error fetching countries');
        return of([]);
      })
    );
  }

  addUpdateCountry(country: Country): Observable<Country> {
    return this.addUpdate<Country>('Countries', country);
  }

  // ###### PROVINCES >>>>>>>>>>>>>
  getProvincesCountryWise(): Observable<Province[]> {
    return this.countryID$.pipe(
      switchMap((countryID) => {
        if (!countryID) return of([]);
        return this.getAll<Province>('Provinces').pipe(
          map((response) =>
            response.filter((province) => province.countryId === countryID)
          )
        );
      })
    );
  }

  getAllProvinces(): Observable<Province[]> {
    return this.getAll<Province>('Provinces').pipe(
      map((response: Province[]) =>
        response.filter((province: Province) => province.status === 1)
      )
    );
  }

  addUpdateProvince(province: Province): Observable<Province> {
    return this.addUpdate<Province>('Provinces', province);
  }

  // ###### DISTRICTS >>>>>>>>>>>>>

  getDistrictsProvinceWise(): Observable<District[]> {
    return this.provinceID$.pipe(
      switchMap((provinceID) => {
        if (!provinceID) return of([]); // Return empty array if no province selected
        return this.getAll<District>('Districts').pipe(
          map((response) =>
            response.filter((district) => district.provinceId === provinceID)
          )
        );
      })
    );
  }
  getAllDistricts(): Observable<District[]> {
    return this.getAll<District>('Districts').pipe(
      map((response: District[]) =>
        response.filter((district: District) => district.status === 1)
      )
    );
  }

  addUpdateDistricts(district: District): Observable<District> {
    return this.addUpdate<District>('Districts', district);
  }

  // ###### CITIES >>>>>>>>>>>>>

  getCities(): Observable<City[]> {
    return this.getAll<City>('Cities').pipe(
      map((response: City[]) =>
        response.filter((city: City) => city.status === 1)
      )
    );;
  }

  addUpdateCities(city: City): Observable<City> {
    return this.addUpdate<City>('Cities', city);
  }

  // ###### DESIGNATIONS >>>>>>>>>>>>>

  getDesignations(): Observable<Designation[]> {
    return this.getAll<Designation>('Designations').pipe(
      map((departments) =>
        departments.map((desgn) => ({
          ...desgn, // Spread existing properties
          id: desgn.desgnId,
          // Add new property 'id'
        }))
      )
    );
  }

  addUpdateDesignations(designation: Designation): Observable<Designation> {
    return this.addUpdate<Designation>('Designations', designation);
  }

  // Third Phase
  getSpeciality(): Observable<Speciality[]> {
    return this.getAll<Speciality>('Specialities').pipe(
      map((Specialities) =>
        Specialities.map((spec) => ({
          ...spec, // Spread existing properties
          id: spec.spId, // Add new property 'id'
        }))
      )
    );
  }
  getSubSpeciality(): Observable<SubSpeciality[]> {
    this.getAll<SubSpeciality>('SubSpecialities')
      .pipe(
        map((specialities) =>
          specialities.map((spec) => ({
            ...spec,
            id: spec.subSpId, // Add 'id' property
          }))
        )
      )
      .subscribe((specialities) => {
        this.subSpecialities$.next(specialities); // Push all subSpecialities into BehaviorSubject
      });

    return this.specialityID$.pipe(
      switchMap((specialityID) => {
        if (!specialityID) return of([]);
        return this.subSpecialities$.pipe(
          map((specialities) => {
            console.log('specialities: ', specialities);
            return specialities.filter((spec) => spec.spId === specialityID);
          })
        );
      })
    );
  }
    
  getGrades(): Observable<Grades[]> {
    return this.getAll<Grades>('EducationGrades');
    //   .pipe(
    //     map((Grades) =>
    //       Grades.map(grade => ({
    //         ...grade,   // Spread existing properties
    //         id: grade.subSpId  // Add new property 'id'
    //       }))
    //     )
    //   );;
  }
}
