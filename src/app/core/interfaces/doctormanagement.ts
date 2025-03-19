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
