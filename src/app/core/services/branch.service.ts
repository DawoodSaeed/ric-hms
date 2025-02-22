import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Branch,
  Building,
  Floor,
  Room,
  Bed,
} from '../interfaces/branch.interface';

import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private baseUrl = `${environment.apiUrl}api/Branch`;

  constructor(private http: HttpClient) {}

  // Branches
  getAllBranches(): Observable<Branch[]> {
    return this.http
      .get<Branch[]>(`${this.baseUrl}/AllBranches`)
      .pipe(catchError(this.handleError));
  }

  addOrUpdateBranch(branch: Branch): Observable<Branch> {
    return this.http
      .post<Branch>(`${this.baseUrl}/AddOrUpdateBranch`, branch)
      .pipe(catchError(this.handleError));
  }

  // Buildings
  getAllBuildings(): Observable<Building[]> {
    return this.http
      .get<Building[]>(`${this.baseUrl}/AllBuildings`)
      .pipe(catchError(this.handleError));
  }

  addOrUpdateBuilding(building: Building): Observable<Building> {
    return this.http
      .post<Building>(`${this.baseUrl}/AddOrUpdateBuilding`, building)
      .pipe(catchError(this.handleError));
  }

  // Floors
  getAllFloors(): Observable<Floor[]> {
    return this.http
      .get<Floor[]>(`${this.baseUrl}/AllFloors`)
      .pipe(catchError(this.handleError));
  }

  createOrUpdateFloor(floor: Floor): Observable<Floor> {
    return this.http
      .post<Floor>(`${this.baseUrl}/CreateOrUpdateFloor`, floor)
      .pipe(catchError(this.handleError));
  }

  // Rooms
  getAllRooms(): Observable<Room[]> {
    return this.http
      .get<Room[]>(`${this.baseUrl}/AllRooms`)
      .pipe(catchError(this.handleError));
  }

  createOrUpdateRoom(room: Room): Observable<Room> {
    return this.http
      .post<Room>(`${this.baseUrl}/AllRooms`, room)
      .pipe(catchError(this.handleError));
  }

  // Beds
  getAllBeds(): Observable<Bed[]> {
    return this.http
      .get<Bed[]>(`${this.baseUrl}/AllBeds`)
      .pipe(catchError(this.handleError));
  }

  createOrUpdateBed(bed: Bed): Observable<Bed> {
    return this.http
      .post<Bed>(`${this.baseUrl}/AllBeds`, bed)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
          `body was: ${JSON.stringify(error.error)}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
