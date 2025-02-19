import { Injectable } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { FormStructure } from '../interfaces/dynamicforminterface';
@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor(private fb: FormBuilder) {}

  createForm(formStructure: FormStructure): FormGroup {
    const formGroup = this.fb.group({});
  
    if (formStructure.tabs) {
      // Handle form with tabs and sections
      formStructure.tabs.forEach(tab => {
        tab.sections.forEach(section => {
          section.fields.forEach(field => {
            formGroup.addControl(
              field.name,
              this.fb.control(
                field.type === 'select' ? 0 : field.type === 'date' ? null:'', // Set 0 for select fields
                field.required ? Validators.required : null
              )
            );
          });
        });
      });
    } else if (formStructure.sections) {
      // Handle flat form with sections
      formStructure.sections.forEach(section => {
        section.fields.forEach(field => {
          formGroup.addControl(
            field.name,
            this.fb.control(
              field.type === 'select' ? 0 : field.type === 'date' ? null:'', // Set 0 for select fields
              field.required ? Validators.required : null
            )
          );
        });
      });
    } else if (formStructure.fields) {
      // Handle simple flat form (no tabs, no sections)
      formStructure.fields.forEach(field => {
        formGroup.addControl(
          field.name,
          this.fb.control(
            field.type === 'select' ? 0 : field.type === 'date' ? null:'', // Set 0 for select fields
            field.required ? Validators.required : null
          )
        );
      });
    }
  
    return formGroup;
  }
  
}

