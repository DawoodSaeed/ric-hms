import { Observable } from "rxjs";

export interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?:string;
  options?: { value: number; label: string }[];
}

export interface FormSection {
  title: string;
  fields: FormField[];

}

export interface FormTab {
  tabName: string;
  apiToCall?:(formData:any)=>Observable<any>;
  multipleEntries?:boolean;
  sections: FormSection[];
}

export interface FormStructure {
  globalTitle: string;
  tabs?: FormTab[];
  sections?: FormSection[];
  fields?:FormField[]
}