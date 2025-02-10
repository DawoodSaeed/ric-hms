import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  private user = signal<{ role: string } | null>(null);

  login(role: string) {
    this.user.set({ role });
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
}
