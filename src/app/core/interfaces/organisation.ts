export interface Department {
  did: number;
  name: string;
  description: string;
  code: string;
  deptCatId: number;
  canCheckIn: number;
  isInPatient: number;
  isSurgical: number;
  amount: number;
  discountTypeId: number;
  discount: number;
  discountedAmount: number;
  status: number;
  createdById: number;
  createdOn: string;
  modifiedById: number;
  modifiedOn: string;
}

export interface SubDepartment {
  subDid: number;
  name: string;
  description: string;
  code: string;
  did: number;
  createdById: number;
  createdOn: string;
  modifiedById: number;
  modifiedOn: string;
  departmentId?:number
}

export interface Service {
  sid: number;
  name: string;
  description: string;
  branchId: number;
  status: number;
  createdById: number;
  createdOn: string;
  modifiedById: number;
  modifiedOn: string;
}
