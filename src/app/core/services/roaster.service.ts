import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Roaster, RoasterSchedule } from '../interfaces/roaster.interface';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class RoasterService {
  private apiUrl = `${environment.apiUrl}Roaster`;

  constructor(private http: HttpClient) {}

  // Get all roasters
  getAllRoasters(month: number, year: number): Observable<Roaster[]> {
    return this.http
      .get<Roaster[]>(`${this.apiUrl}/allRoasters?month=${month}&year=${year}`)
      .pipe(catchError(this.handleError));
  }

  // Add a new roaster
  addRoaster(roaster: Roaster): Observable<Roaster> {
    return this.http
      .post<Roaster>(`${this.apiUrl}/addRoaster`, roaster)
      .pipe(catchError(this.handleError));
  }

  // Get all roaster schedules
  getAllRoasterSchedules(roasterId: number): Observable<RoasterSchedule[]> {
    return this.http
      .get<RoasterSchedule[]>(
        `${this.apiUrl}/allRoasterSchedules?rosterid=${roasterId}`
      )
      .pipe(catchError(this.handleError));
  }

  // Add a new roaster schedule
  addRoasterSchedule(schedule: RoasterSchedule): Observable<RoasterSchedule> {
    return this.http
      .post<RoasterSchedule>(`${this.apiUrl}/addRoasterSchedule`, schedule)
      .pipe(catchError(this.handleError));
  }

  // Handle HTTP Errors
  private handleError(error: HttpErrorResponse) {
    console.error('Server Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}