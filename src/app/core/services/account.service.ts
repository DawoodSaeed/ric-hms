import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ChangePassword, Role, User } from '../interfaces/account';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor() {}

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'Account';

  user$ = this.http.get<User[]>(`${this.apiUrl}/AllUsers`);
  roles$ = this.http.get<Role[]>(`${this.apiUrl}/AllRoles`);

  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/DeleteUser?id=${userId}`);
  }

  registerUser(user: User, roleId: number) {
    return this.http.post(`${this.apiUrl}/register?RoleID=${roleId}`, user);
  }

  createRole(role: Role) {
    return this.http.post(`${this.apiUrl}/CreateRole`, role);
  }

  changePassword(changePassword: ChangePassword): Observable<{
    message?: string;
  }> {
    return this.http.put<{ message?: string }>(
      `${this.apiUrl}/ChangePassword`,
      changePassword
    );
  }

  resetPassword(resetPassword: { newPassword: string; userId: number }) {
    return this.http.put(
      `${this.apiUrl}/ResetPassword?userId=${resetPassword.userId}&newPassword=${resetPassword.newPassword}`,
      {}
    );
  }
}
