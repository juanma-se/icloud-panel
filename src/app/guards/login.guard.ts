import { Injectable, inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { EncryptedCookieService } from '../services/encrypted-cookie.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
class LoginService {

  constructor(
    private router: Router,
    private cookie: EncryptedCookieService,
    private auth: AuthService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.auth.isAutenticate()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

export const LoginGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(LoginService).canActivate(next, state);
}