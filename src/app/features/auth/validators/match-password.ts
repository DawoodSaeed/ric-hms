import { FormGroup, Validator } from '@angular/forms';

export class MatchPassword implements Validator {
  validate(formGroup: FormGroup) {
    const { password, confrimPassword } = formGroup.value;

    if (password === confrimPassword) {
      return null;
    } else {
      return { passwordDontMatch: true };
    }
  }
}
