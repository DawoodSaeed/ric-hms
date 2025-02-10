// src/app/core/role.guard.ts
import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data?.['role'];

  if (!requiredRole || authService.getRole() === requiredRole) {
    return true;
  }

  router.navigate(['/']); // Redirect to home if unauthorized
  return false;
};
