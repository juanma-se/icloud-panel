import { lastValueFrom, throwError } from 'rxjs';

import { EncryptedCookieService } from '@app/services/encrypted-cookie.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '@models/login'
import { Register } from '@models/register'
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';

const PUBLIC_API = `${environment.api_base_url}`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  error: any;
  errorCodes: Array<any> = [
    400,
    401,
    402,
    403,
    404,
    405,
    406,
    500,
    501
  ];

  constructor(
    private http: HttpClient,
    private cookie: EncryptedCookieService,
  ) {}

  /** Metodo con asyncrono para el login */
  async asyncLoginPanel(loginForm: Login): Promise<any> {    
    const apiResponse = await lastValueFrom(
      this.http.post(
        PUBLIC_API + '/login', loginForm
      ).pipe(
        catchError(err => {
          return this.handleError(err, true);
        })
    ));
    return apiResponse;
  }

  /** Comprobación del estado de login del usuario */
  isAutenticate() {
    const loginData = this.cookie.getDecryptedCookie(environment.auth_cookie);

    if(loginData) {
      const autenticado: Login = JSON.parse(loginData);
      return autenticado.login ?? false;
    }
    this.cookie.deleteAllCookies();
    return false;
  }

  async asyncRegisterPanel(registerForm: Register): Promise<any> {
    const apiResponse = await lastValueFrom(
      this.http.post(
        PUBLIC_API + '/register', registerForm
      ).pipe(
        catchError(err => {
          return this.handleError(err);
        })
    ));
    return apiResponse;
  }

  private handleError(err: any, deleteCookies: boolean = false) {
    if(this.errorCodes.includes(err.status)) {
      this.error = {...err.error };
      this.error.code = err.status;
    }
    if(deleteCookies) {
      this.cookie.deleteAllCookies();
    }
    return throwError(() => this.error);
  }
}
