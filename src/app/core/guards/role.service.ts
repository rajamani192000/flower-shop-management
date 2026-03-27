import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserRole } from '../../shared/models/app.models';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const expectedRoles = route.data['roles'] as UserRole[];
    return this.authService.userProfile$().pipe(
      map((profile) => {
        if (!profile) {
          this.router.navigate(['/login']);
          return false;
        }
        if (!expectedRoles || expectedRoles.includes(profile.role)) {
          return true;
        }
        this.router.navigate(['/dashboard']);
        return false;
      })
    );
  }
}
