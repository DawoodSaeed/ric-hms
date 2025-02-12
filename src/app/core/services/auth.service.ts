import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/auth';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private apiUrl = environment.apiUrl + 'auth';
  private user = signal<{ role: string } | null>(null);

  login(username: string, password: string) {
    return this.http
      .post<User>(`${this.apiUrl}/login`, {
        username: username,
        password: password,
      })
      .pipe(
        tap((user) => {
          this.tokenService.setToken(user.token);
        })
      );
  }

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/auth/login']);
  }

  getRole(): string | null {
    return this.user()?.role || null;
  }

  isLoggedIn(): boolean {
    // REMOVE THIS LINE ########################
    this.setUser({ role: 'admin' });
    return !!this.tokenService.getAccessToken();
  }

  setUser(user: { role: string } | null) {
    this.user.set(user);
  }
}
