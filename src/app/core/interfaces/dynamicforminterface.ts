export interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?:string;
  options?: { value: string; label: string }[];
}

export interface FormSection {
  title: string;
  fields: FormField[];
}

export interface FormTab {
  tabName: string;
  sections: FormSection[];
}

export interface FormStructure {
  globalTitle: string;
  tabs?: FormTab[];
  sections?: FormSection[];
  fields?:FormField[]
}