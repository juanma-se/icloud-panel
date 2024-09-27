import { Injectable, inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { EncryptedCookieService } from '../services/encrypted-cookie.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
class ReturnDashboardService {

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.auth.isAutenticate()) {
      this.router.navigate(['/dashboard']);
    }
    return false;
  }
}

export const ReturnDashboardGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(ReturnDashboardService).canActivate(next, state);
}