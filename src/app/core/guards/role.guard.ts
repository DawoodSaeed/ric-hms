import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredRole = route.data['role'];
    console.log(requiredRole);
    return this.authService.checkAuth().pipe(
      map((response: { valid: boolean; role: string }) => {
        const { valid, role } = response || { valid: false, role: '' };

        if (valid && role === requiredRole) {
          return true; // Access granted for correct role
        }

        this.router.navigate([`/${role.toLowerCase()}`]); // Redirect if role mismatch
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login']); // Redirect if error occurs
        return of(false);
      })
    );
  }
}
