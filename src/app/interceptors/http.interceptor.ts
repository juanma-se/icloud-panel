import { Privilege, User } from '@models/user';

import { EncryptedCookieService } from '../services/encrypted-cookie.service'
import { HttpHeaders } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environments/environment';
import { inject } from '@angular/core';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const cookie = inject(EncryptedCookieService);
  /** obtenemos el token almacenado */
  const data: string = cookie.getDecryptedCookie(environment.api_token);
  const token = `Bearer ${data}`;

  const authUrl: Array<string> = [
    `${environment.api_base_url}/login`,
    `${environment.api_base_url}/register`,
    `${environment.api_base_url}/logout`,
  ];

  // Determinar si el cuerpo de la solicitud es FormData
  const isFormData = req.body instanceof FormData;

  let headers = new HttpHeaders({
    'Authorization': token
  });

  // Establecer Content-Type solo si no es FormData
  if (!isFormData) {
    headers = headers.set('Content-Type', 'application/json');
  }

  const customReq = req.clone({headers});

  if (authUrl.includes(req.url)) {
    return next(req);
  }
  return next(customReq);
};
