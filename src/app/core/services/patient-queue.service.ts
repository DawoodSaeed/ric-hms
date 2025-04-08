import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  PatientCheckInDetails,
  PatientQueueFilter,
  PatientVitals,
} from '../interfaces/patients-queue';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PatientQueueService {
  private apiUrl = environment.apiUrl + 'PatientQueue';
  private http = inject(HttpClient);

  constructor() {}

  addOrUpdatePatientVitals(
    payload: PatientVitals
  ): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/AddUpdatePatientVitals`,
      payload
    );
  }

  // GET: Fetch patient queue with optional filters
  getPatientQueue(
    filters: PatientQueueFilter
  ): Observable<PatientCheckInDetails[]> {
    let params = new HttpParams();
    if (filters.PatientCheckInStatus !== undefined) {
      params = params.set('PatientCheckInStatus', filters.PatientCheckInStatus);
    }
    if (filters.WorkingSessionID !== undefined) {
      params = params.set('WorkingSessionID', filters.WorkingSessionID);
    }
    if (filters.DocID !== undefined) {
      params = params.set('DocID', filters.DocID);
    }
    if (filters.DeptID !== undefined) {
      params = params.set('DeptID', filters.DeptID);
    }

    return this.http.get<PatientCheckInDetails[]>(
      `${this.apiUrl}/GetPatientQueue`,
      { params }
    );
  }

  // GET: Fetch vitals of a specific patient
  getPatientVitals(patientId: number): Observable<PatientVitals[]> {
    const params = new HttpParams().set('PatientID', patientId);
    return this.http.get<PatientVitals[]>(`${this.apiUrl}/PatientVitals`, {
      params,
    });
  }
}
