import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, map } from "rxjs";

import { EncryptedCookieService } from '@app/services/encrypted-cookie.service';
import { HttpResponse } from '@models/http-response'
import { Injectable } from '@angular/core';
import { User } from "@models/user";
import { environment } from '@environments/environment';

const AUTH_API_V1 = `${environment.api_base_url}`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _data: any;
  private error: any;

  constructor(
    private http: HttpClient,
    private cookie: EncryptedCookieService,
  ) { }

  public getUsers(): Observable<User[]> {
    //La url para pedir la data inicial
    const url = `${AUTH_API_V1}/user`;

    const data = this.http.get(url).pipe(
      map((response: any) => response.data)
    );
    return data;
  }
}
