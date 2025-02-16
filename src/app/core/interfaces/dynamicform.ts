export interface FormField {
    name: string;
    type: string;
    label: string;
    required?: boolean;
    options?: { value: string; label: string }[]; // For select/dropdowns
  }
  
  export interface FormTab {
    tabName: string;
    fields: FormField[];
  }
  
  export interface FormStructure {
    title: string;
    tabs?: FormTab[]; // Optional tabs
    fields?: FormField[]; // Optional flat fields if no tabs
  }
  