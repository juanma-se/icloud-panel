import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class EncryptedCookieService {

  private key = '/%C-9LUWEO%T/1VMHX[4M7)C9V9)QX!N-CNLT65#7WNKN8H.T!XY]V)0$T*E*'

  constructor(private cookieService: CookieService) { }

  getDecryptedCookie(name: string) {
    if (this.cookieService.check(name)&&this.cookieService.get(name)!=='') {
      let bytes = crypto.AES.decrypt(this.cookieService.get(name), this.key).toString(crypto.enc.Utf8);
      return JSON.parse(bytes).value;
    }
    return '';
  }

  setEncryptedCookie(name: string, value: string) {
    let encryptedValue = crypto.AES.encrypt(JSON.stringify({ value }), this.key).toString();
    this.cookieService.set(name, encryptedValue);
  }

  deleteCookie(name: string) {
    this.cookieService.delete(name);
  }

  deleteAllCookies() {
    this.cookieService.deleteAll();
  }
}
