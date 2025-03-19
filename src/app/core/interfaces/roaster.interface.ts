export interface Roaster {
  id?: number;
  name: string;
  description: string;
  departmentId: number;
  month: number;
  year: number;
  branchId: number;
  createdById?: number;
  createdOn?: string;
  modifiedById?: number;
  modifiedOn?: string;
  isActive: number;
}

export interface RoasterSchedule {
  id: number;
  name: string;
  description: string;
  date: string;
  rosterId: number;
  empId: number;
  timeShiftId: number;
  createdById: number;
  createdOn: string;
  modifiedById: number;
  modifiedOn: string;
  isActive: number;
  empName?: string;
  cnic?: string;
}
