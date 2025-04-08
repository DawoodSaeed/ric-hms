import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import {
  Doctor,
  DoctorTemplate,
  DoctorTemplateComplaint,
  DoctorTemplateComplaintIds,
  DoctorTemplateDiagnosisIds,
  DoctorTemplateFollowUp,
  DoctorTemplateFollowUpIds,
  DoctorTemplateInstruction,
  DoctorTemplateInstructionIds,
  EmployeeDropdown,
} from '../interfaces/doctormanagement';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctormanagementService {
  private API_URL = environment.apiUrl + 'DoctorManagement';
  http = inject(HttpClient);
  constructor() {}

  getDoctors():Observable<Doctor[]> {
    console.log('cpi');
    return this.http.get<Doctor[]>(`${this.API_URL}/AllDoctors`);
  }

  registerDoctor(doctor: Doctor) {
    return this.http.post(`${this.API_URL}/register`, doctor);
  }

  employeeDropdown() {
    return this.http.get<EmployeeDropdown[]>(`${this.API_URL}/EmpDropdown`);
  }

  getDoctorTemplatesById(docId?: number): Observable<DoctorTemplate[]> {
    return this.http.get<DoctorTemplate[]>(
      `${this.API_URL}/DoctorTemplatesById/${docId ? docId : ''}`
    );
  }

  addOrUpdateDoctorTemplate(template: DoctorTemplate): Observable<any> {
    return this.http.post(
      `${this.API_URL}/AddOrUpdateDoctorTemplate`,
      template
    );
  }

  getDoctorTemplateInstructions(): Observable<DoctorTemplateInstruction[]> {
    return this.http.get<DoctorTemplateInstruction[]>(
      `${this.API_URL}/AllDoctorTemplateInstructions`
    );
  }

  addOrUpdateDoctorTemplateInstruction(
    instruction: DoctorTemplateInstructionIds
  ): Observable<any> {
    return this.http.post(
      `${this.API_URL}/AddOrUpdateDoctorTemplateInstructions`,
      instruction
    );
  }

  getDoctorTemplateFollowUps(): Observable<DoctorTemplateFollowUp[]> {
    return this.http.get<DoctorTemplateFollowUp[]>(
      `${this.API_URL}/AllDoctorTemplateFollowUps`
    );
  }

  addOrUpdateDoctorTemplateFollowUp(
    followUp: DoctorTemplateFollowUpIds
  ): Observable<any> {
    return this.http.post(
      `${this.API_URL}/AddOrUpdateDoctorTemplateFollowUps`,
      followUp
    );
  }

  getDoctorTemplateComplaints(): Observable<DoctorTemplateComplaint[]> {
    return this.http.get<DoctorTemplateComplaint[]>(
      `${this.API_URL}/AllDoctorTemplateComplaints`
    );
  }

  addOrUpdateDoctorTemplateComplaint(
    complaint: DoctorTemplateComplaintIds
  ): Observable<any> {
    return this.http.post(
      `${this.API_URL}/AddOrUpdateDoctorTemplateComplaints`,
      complaint
    );
  }

  addOrUpdateDoctorTemplateDiagnosis(
    diagnosis: DoctorTemplateDiagnosisIds
  ): Observable<any> {
    return this.http.post(
      `${this.API_URL}/AddOrUpdateDoctorTemplateDiagnoses`,
      diagnosis
    );
  }
}
