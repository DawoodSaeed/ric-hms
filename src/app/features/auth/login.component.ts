import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageModule } from 'primeng/message';
@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MessageModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  commonService = inject(ThemeService);
  authForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
      Validators.pattern(/^[a-z0-9]+$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ]),
  });

  login() {
    if (this.authForm.invalid) {
      this.showError('Please Fix all the form errors.');
      return null;
    }

    return;
  }

  showError(message: string) {
    // this.messageService.add({
    //   severity: 'error',
    //   summary: 'Login Failed',
    //   detail: message,
    // });
  }
}

// Authentication set - up .
// Layout steup
