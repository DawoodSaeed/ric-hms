import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'auth';
  private user = signal<{ role: string } | null>(null);

  // For user login...
  login(username: string, password: string) {
    return this.http.post<User>(`${this.apiUrl}/login`, {
      username: username,
      password: password,
    });
  }

  logout() {
    this.user.set(null);
  }

  getRole(): string | null {
    return this.user()?.role || null;
  }

  isLoggedIn(): boolean {
    return !!this.user();
  }

  setUser(user: { role: string } | null) {
    this.user.set(user);
  }
}
