import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator to ensure at least one item is selected
export function atLeastOneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && value.length > 0) {
      return null; // Valid
    }
    return { atLeastOneRequired: true }; // Invalid
  };
}
