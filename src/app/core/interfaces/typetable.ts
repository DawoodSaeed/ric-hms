export interface TypeTable {
  id?: number;
  name: string;
  description: string;
  createdById?: number | string;
  createdOn?: string;
  modifiedById?: number | string;
  modifiedOn?: string;
  isActive: number | boolean;
}

export interface Bank extends TypeTable {
  bankId?: number;
  abbrivation: string;
  code: string;
  bank: number;
}

export interface DepartmentCategory extends TypeTable {
  dcid?: number;
  branchId: number;
}

export interface EducationDegree extends TypeTable {
  degId?: number;
}

export interface EducationInstitution extends TypeTable {
  eduIntId?: number;
}

export interface FieldOfStudy extends TypeTable {
  fsid?: number;
}

export interface JobType extends TypeTable {
  isDeleted: boolean;
  enableGp: boolean;
  enableGi: boolean;
  enableBf: boolean;
  value: number;
  enableIncomeTax: boolean;
  enableServiceTax: boolean;
  isHonorary: boolean;
  branchId: number;
}

export interface OrganizationType extends TypeTable {
  orgTid?: number;
}

export interface PatientType extends TypeTable {
  createdBy?: number;
  modifiedBy?: number;
}

export interface Scale extends TypeTable {
  minSalary: number;
  maxSalary: number;
  branchId: number;
  gazzatedType: number;
  preference: number;
}

export interface WorkingSession extends TypeTable {
  wsid?: number;
  startTime: string;
  endTime: string;
  branchId: number;
  isModay: boolean;
  isTuesday: boolean;
  isWednesday: boolean;
  isThursday: boolean;
  isFriday: boolean;
  isSaturday: boolean;
  isSunday: boolean;
  createdById: string;
  modifiedById: string;
}

export interface DepartmentCategory extends TypeTable {
  dcid?: number;
  branchId: number;
}

export interface EducationDegree extends TypeTable {
  degId?: number;
}

export interface EducationInstitution extends TypeTable {
  eduIntId?: number;
}

export interface FieldOfStudy extends TypeTable {
  fsid?: number;
}

export interface JobType extends TypeTable {
  isDeleted: boolean;
  enableGp: boolean;
  enableGi: boolean;
  enableBf: boolean;
  value: number;
  enableIncomeTax: boolean;
  enableServiceTax: boolean;
  isHonorary: boolean;
  branchId: number;
}

export interface OrganizationType extends TypeTable {
  orgTid?: number;
}

export interface PatientType extends TypeTable {
  createdBy?: number;
  modifiedBy?: number;
}

export interface Scale extends TypeTable {
  minSalary: number;
  maxSalary: number;
  branchId: number;
  gazzatedType: number;
  preference: number;
}

export interface CheckInType extends TypeTable {}
export interface DiscountType extends TypeTable {}
export interface EmploymentStatus extends TypeTable {}
export interface Facility extends TypeTable {}
export interface GuardianType extends TypeTable {}
export interface PaymentMethod extends TypeTable {
  branchId: number;
}
export interface Relation extends TypeTable {}
export interface Religion extends TypeTable {}
export interface PatientCheckInStatus extends TypeTable {}

// Stage # 2 of making the typetable #################
export interface Country extends TypeTable {
  cid?: number;
  code: string;
  phoneCode: string;
  currencyCode: string;
  status: number;
}

export interface Province extends TypeTable {
  pid?: number;
  code: string;
  cid: number;
  status: number;
}

export interface District extends TypeTable {
  did?: number;
  pid: number;
  cid: number;
  status: number;
}

export interface City extends TypeTable {
  id?: number;
  pid: number;
  cid: number;
  status: number;
}

export interface Designation extends TypeTable {
  desgnId?: number;
}

export interface Speciality extends TypeTable {
  spId: number;
  keyWord: string;
  branchId: number;
  status: number;

}
export interface SubSpeciality extends TypeTable {
  subSpId: number;
  spId: number;
  keyWord: string;
  status: number;
}
