// branch.interface.ts
export interface Branch {
  branchId: number;
  branchName: string;
  createdBy: number;
  createdOn: string;
  updatedBy: number;
  updatedOn: string;
}

export interface Building {
  bid: number;
  name: string;
  description: string;
  status: number;
  branchId: number;
  createdById: number;
  createdOn: string;
  modifiedById: number;
  modifiedOn: string;
  building?: number;
}

export interface Floor {
  fid: number;
  name: string;
  description: string;
  bid: number;
  branchId: number;
  status: number;
  createdById: number;
  createdOn: string;
  modifiedById: number;
  modifiedOn: string;
  buildingName?: string;
}

export interface Room {
  rid: number;
  name: string;
  description: string;
  bid: number;
  fid: number;
  branchId: number;
  status: number;
  createdById: number;
  createdOn: string;
  modifiedById: number;
  modifiedOn: string;
}

export interface Bed {
  bdId: number;
  name: string;
  description: string;
  bid: number;
  fid: number;
  rid: number;
  branchId: number;
  priceId: number;
  minValue: number;
  maxValue: number;
  isVacant: boolean;
  isFemale: boolean;
  status: number;
  createdById: number;
  createdOn: string;
  modifiedById: number;
  modifiedOn: string;
  chargesType: 'Once' | 'Periodic';
}
