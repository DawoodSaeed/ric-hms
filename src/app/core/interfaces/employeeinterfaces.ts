export interface EmployeeAward {
  empId: number;
    empAwrdId: number;
    name: string;
    code: string;
    awardedBy: string;
    description: string;
    awardDate: string; 
    status: number;
    createdById?: number;
    createdOn?: string; 
    modifiedById?: number;
    modifiedOn?: string;
  }
  

  export interface EmployeeBankDetails {
    empBankId: number;
    empId: number;
    bankId: number;
    accountTitle: string;
    accountNo: string;
    branchName: string;
    branchCode: string;
    iban: string;
    status: number;
    createdById?: number;
    createdOn?: string; // ISO datetime format
    modifiedById?: number;
    modifiedOn?: string; // ISO datetime format
  }
  
  export interface EmployeeEducation {
    empEduId: number;
    empId: number;
    countryId: number;
    eduIntId: number;
    degId: number;
    fsid: number;
    startDate: string; // "YYYY-MM-DD" format
    endDate: string; // "YYYY-MM-DD" format
    issueDate: string; // "YYYY-MM-DD" format
    gradingId: number;
    totalMarks: number;
    obtainMarks: number;
    status: number;
    isCurrent: boolean;
    createdById?: number;
    createdOn?: string; // ISO datetime format
    modifiedById?: number;
    modifiedOn?: string; // ISO datetime format
    certificatePath: string;
  }
  
  export interface EmployeeDepartment {
    empDid: number;
    did: number;
    empId: number;
    createdById?: number;
    createdOn?: string; // ISO datetime format
    modifiedById?: number;
    modifiedOn?: string; // ISO datetime format
  }
  
  export interface EmployeeSubDepartment {
    empSubDid: number;
    subDid: number;
    empId: number;
    createdById?: number;
    createdOn?: string; // ISO datetime format
    modifiedById?: number;
    modifiedOn?: string; // ISO datetime format
  }

  export interface EmployeeDesignation {
    empDesgnId: number;
    empId: number;
    desgnId: number;
    createdById?: number;
    createdOn?: string; // ISO datetime format
    modifiedById?: number;
    modifiedOn?: string; // ISO datetime format
  }

  export interface EmployeeExperience {
    empExpId: number;
    empId: number;
    title: string;
    company: string;
    description: string;
    fromDate: string; // "YYYY-MM-DD" format
    toDate: string; // "YYYY-MM-DD" format
    status: number;
    createdById?: number;
    createdOn?: string; // ISO datetime format
    modifiedById?: number;
    modifiedOn?: string; // ISO datetime format
    certificatePath: string;
  }
  export interface EmployeeFacility {
    empFacilityId: number;
    empId: number;
    facilityId: number;
    createdById?: number;
    createdOn?: string; // ISO datetime format
    modifiedById?: number;
    modifiedOn?: string; // ISO datetime format
  }
  export interface EmployeeSpecialization {
    empSpId: number;
    empId: number;
    spId: number;
    status: number;
    createdById?: number;
    createdOn?: string; // ISO datetime format
    modifiedById?: number;
    modifiedOn?: string; // ISO datetime format
  }
  export interface EmployeeSubSpecialization {
    empSubSpId: number;
    empId: number;
    subSpId: number;
    status: number;
    createdById?: number;
    createdOn?: string; // ISO datetime format
    modifiedById?: number;
    modifiedOn?: string; // ISO datetime format
  }
  
  
  
  