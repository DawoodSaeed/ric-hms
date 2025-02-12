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
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
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
  authService = inject(AuthService);
  router = inject(Router);
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
      return;
    }

    this.authService
      .login(
        this.authForm.get('username')?.value || '',
        this.authForm.get('password')?.value || ''
      )
      .subscribe({
        
        next: (user) => {
          console.log(user.token);
          this.authService.setUser({ role: 'admin' });
          this.router.navigate(['/admin/']);
        },

        error: (err) => {
          if (!err.status) {
            this.authForm.setErrors({
              noConnection: true,
            });
          } else if (err.status == 401) {
            this.authForm.setErrors({
              unAuth: true,
            });
          } else {
            this.authForm.setErrors({
              unknown: true,
            });
          }
        },
      });
  }
}

// Authentication set - up .
// Layout steup
