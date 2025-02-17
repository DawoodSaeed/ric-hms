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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // check if the tokens are present
    let navigateToLogin = true;
    if (this.authService.isLoggedIn()) {
      this.authService.checkAuth().subscribe({
        next: (valid) => {
          if (valid) {
            navigateToLogin = false;
            console.log('##############', this.authService.getRole());
            this.router.navigate([`/${this.authService.getRole()}/`]);
          }

          navigateToLogin = true;
        },

        error: () => {
          navigateToLogin = true;
        },
      });
      return navigateToLogin;
    } else {
      return true;
    }
  }
}
