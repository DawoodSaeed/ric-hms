import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PatientRegistration } from '../interfaces/patient.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'Patient';

  constructor() {}

  addPatient = (patient: PatientRegistration): Observable<any> => {
    return this.http.post<{ message: string; empid: number }>(
      `${this.apiUrl}/AddPatient`,
      patient
    );
  };

  getPatientByCnic = (cnic: string): Observable<PatientRegistration> => {
    return this.http
      .get<any>(`${this.apiUrl}/PatientByCNIC/${cnic}`)
      .pipe(map((response) => response.patient));
  };
}
