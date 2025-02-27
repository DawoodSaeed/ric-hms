interface common {
  createdById: number;
  createdOn: string; // or Date if you want to parse it as a Date object
  modifiedById: number;
  modifiedOn: string; // or Date
}

export interface User extends common {
  empId: number;
  password: string;
  status: number; // or boolean if it represents an active/inactive state
  userId: number;
  userName: string;
}

export interface Role extends common {
  id: number;
  name: string;
  description: string;
  isActive: number; // or boolean if it represents an active/inactive state
}

export interface ChangePassword {
  userId: number;
  currentPassword: string;
  newPassword: string;
}
