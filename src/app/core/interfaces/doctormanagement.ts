export interface Doctor {
  docId: number;
  empId: number;
  licenseNumber: string;
  employeeName: string;
  cnic: string;
  picture: string | null;
  personalNumber: string;
  gender: string;
  pmcnumber: string;
  pmccertificate: string;
  displayDesignation: string;
  displayQualification: string;
  electronicSignature: string;
  consultationFee: number;
  followUpFee: number;
  status: number;
  createdById: number;
  createdOn: string; // ISO Date format
  modifiedById: number;
  modifiedOn: string; // ISO Date format
}

export interface EmployeeDropdown {
  empId: number;
  employeeName: string;
}

// models/base-entity.model.ts
export interface BaseEntity {
  createdById?: number;
  createdOn?: string;
  modifiedById?: number;
  modifiedOn?: string;
}

export interface DoctorTemplate extends BaseEntity {
  tempId: number;
  name: string;
  description: string;
  docId?: number;
  status: number;
}

export interface DoctorTemplateInstructionIds {
  instrIds: number[];
  docTempId: number;
  docId?: number;
}

export interface DoctorTemplateInstruction extends BaseEntity {
  docInstrId: number;
  docTempId: number;
  docId: number;
  instrId: number;
}

export interface DoctorTemplateFollowUp extends BaseEntity {
  docFollowId: number;
  docTempId: number;
  docId: number;
  followUpId: number;
}

export interface DoctorTemplateComplaint extends BaseEntity {
  docCompId: number;
  docTempId: number;
  docId: number;
  complaintId: number;
}

export interface DoctorTemplateComplaintIds {
  ComplaintIds: number[];
  docTempId: number;
  docId?: number;
}

export interface DoctorTemplateDiagnosisIds {
  diagnosisIds: number[];
  docTempId: number;
  docId?: number;
}

export interface DoctorTemplateFollowUpIds {
  followUpIds: number[];
  docTempId: number;
  docId?: number;
}
