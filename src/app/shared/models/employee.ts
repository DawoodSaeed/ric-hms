export interface Employee {
  empId: number;
  firstName: string;
  lastName: string;
  cnic: string;
  passport: string;
  dob: string; // Use Date if you plan to parse it to a Date object
  gender: string;
  maritalStatus: string;
  religion: string;
  bloodGroupId: number;
  country: number;
  province: number;
  cityDistrict: number;
  address: string;
  mobileNo: string;
  phone: string;
  email: string;
  jobTypeId: number;
  empStatusId: number;
  scaleId: number;
  personalNumber: string;
  badgeNumber: string;
  ntn: string;
  licenseNumber: string;
  appointmentDate: string; // Use Date if needed
  joiningDate: string; // Use Date if needed
  dateOfRetirement: string; // Use Date if needed
  domicileDistrictId: number;
  guadianTypeId: number;
  guadianName: string;
  guadianNic: string;
  noktypeId: number;
  nokrelationId: number;
  nokname: string;
  noknic: string;
  nokmobile: string;
  picture?: string;
  createdById: number;
  createdOn: string; // Use Date if needed
  modifiedById: number;
  modifiedOn: string; // Use Date if needed
  emp: string;
}
