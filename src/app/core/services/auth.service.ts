import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CheckAuth, User } from '../../shared/models/auth';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private apiUrl = environment.apiUrl + 'auth';

  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();
  private loggedInUserId = new BehaviorSubject<string>('');
  loggedInUserId$ = this.loggedInUserId.asObservable();
  private role = '';
  login(username: string, password: string) {
    console.log('login called');
    return this.http
      .post<User>(`${this.apiUrl}/login`, {
        username: username,
        password: password,
      })
      .pipe(
        tap((user) => {
          this.setRole('Admin'.toLocaleLowerCase());
          this.user.next({
            ...user,
            role: 'Admin',
          });

          // setting up the token.
          this.tokenService.setToken(user.token);
        })
      );
  }

  checkAuth() {
    return this.http.get<CheckAuth>(`${this.apiUrl}/verify-token/`).pipe(
      map((auth) => {
        const { valid, role, username, userId } = auth;
        this.loggedInUserId.next(userId);
        this.setRole(role.toLocaleLowerCase());
        return auth;
      })
    );
  }

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/auth/login']);
  }

  getRole(): string | null {
    return this.role;
  }

  setRole(role: string) {
    this.role = role;
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getAccessToken();
  }

  setUser(user: User | null) {
    this.user.next(user);
  }

  getUser() {}
}
