import { Observable, Subscription } from "rxjs";

export interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?:string;
  hide?:boolean
  options?: { value: number|string; label: string }[];
}

export interface FormSection {
  title: string;
  fields: FormField[];

}

export interface FormTab {
  tabName: string;
  apiToCall?:(formData:any)=>Observable<any>;
  showTable?:boolean;
  dataSubscription?:Subscription
  tableData?:any[];
  sections: FormSection[];
}

export interface FormStructure {
  globalTitle: string;
  tabs?: FormTab[];
  sections?: FormSection[];
  fields?:FormField[]
}