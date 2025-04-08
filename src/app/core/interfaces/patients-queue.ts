export interface PatientVitals {
  id: number;
  patientId: number;
  temperature: number;
  pulse: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  spo2: number;
  weight: number;
  timeStamp: string;
  active: boolean;
  visitNo: string;
  isInPatient: boolean;
  respiratoryRate: number;
  height: number;
  headCircumference: number;
  bsr: number;

  //   optional fields....
  workingSessionId?: number;
  checkInDoctorId?: number;
  checkInDepartmentId?: number;
  checkInSubDepartmentId?: number;
  createdById?: number;
  createdOn?: string; // ISO format
  modifiedById?: number;
  modifiedOn?: string; // ISO format
}

export interface PatientQueueFilter {
  PatientCheckInStatus?: PatientCheckInStatusEnum;
  WorkingSessionID?: number;
  DocID?: number;
  DeptID?: number;
}

export enum PatientCheckInStatusEnum {
  // INSERT ENUM VALUES HERE
  CheckedIn = 1,
  OnHold = 2,
  Consulted = 3,
  CheckedOut = 4,
  Discharged = 5,
  Referred = 6,
}

export interface PatientCheckInDetails {
  checkInTime: string;
  deptID: number;
  docDeptName: string;
  doctorCheckInType: string;
  doctorID: number | null;
  mrNo: string;
  pChkInID: number;
  patientCheckInStatusID: number;
  patientID: number;
  patientName: string;
  patientTypeID: number;
  visitNo: string;
}
