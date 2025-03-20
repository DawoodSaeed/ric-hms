export interface PatientRegistration {
  patientId: number;
  mrno: string;
  name: string;
  gender: string;
  maritalStatus: string;
  cnic: string;
  passport: string;
  dob: string; // ISO date string
  religionId: number;
  countryId: number;
  provinceId: number;
  cityId: number;
  address: string;
  mobileNo: string;
  phone: string;
  email: string;
  guadianTypeId: number;
  guadianName: string;
  guadianNic: string;
  noktypeId: number;
  nokrelationId: number;
  nokname: string;
  noknic: string;
  nokmobile: string;
  patientTypeId: number;
  porgId: number;
  packId: number;
  pnlEmpCardNo: string;
  pnlEmpCardExpiry: string; // ISO date string
  pnlDepartment: string;
  designation: string;
  pnlDocument1: string;
  pnlDocument2: string;
  isSelf: boolean;
  dependentNic: string;
  dependentRelationId: number;
  dependentDocument1: string;
  dependentDocument2: string;
  status: number;

  picture: string;
}
