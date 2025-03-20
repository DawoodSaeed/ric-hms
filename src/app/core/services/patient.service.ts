import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
