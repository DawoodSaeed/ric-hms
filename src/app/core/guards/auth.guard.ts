import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      return this.authService.checkAuth().pipe(
        map(({ valid, role }) => {
          if (valid) {
            this.router.navigate([`/${role.toLocaleLowerCase()}`]);
            return false;
          }
          return true;
        }),
        catchError(() => {
          return of(true);
        })
      );
    } else {
      return of(true);
    }
  }
}
