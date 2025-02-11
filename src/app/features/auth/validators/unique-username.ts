import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, FormControl } from '@angular/forms';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UniqueUsername implements AsyncValidator {
  http = inject(HttpClient);

  validate(formControl: FormControl) {
    const { username } = formControl.value;

    return this.http
      .post('/', {
        username,
      })
      .pipe(
        map((data: any) => {
          if (data.avaliable) {
            return null;
          } else {
            return { usernameNotAvaliable: true };
          }
        })
      );
  }
}
