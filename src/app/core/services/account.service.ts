import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Role, User } from '../interfaces/account';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor() {}

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'Account';

  user$ = this.http.get<User[]>(`${this.apiUrl}/AllUsers`);
  roles$ = this.http.get<Role[]>(`${this.apiUrl}/AllRoles`).pipe(shareReplay());

  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/DeleteUser?id=${userId}`);
  }

  registerUser(user: User, roleId: number) {
    return this.http.post(`${this.apiUrl}/register?RoleID=${roleId}`, user);
  }
}
