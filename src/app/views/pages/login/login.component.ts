import { AccessTokenRequest, AccessTokenResponse } from '@models/access-token';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  TextColorDirective
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthService } from '@app/services/auth.service';
import { EncryptedCookieService } from '@app/services/encrypted-cookie.service';
import { HttpResponse } from '@models/http-response';
import { IconDirective } from '@coreui/icons-angular';
import { Login } from '@models/login';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
      ContainerComponent, 
      FormsModule, 
      ReactiveFormsModule, 
      RowComponent, 
      ColComponent, 
      CardGroupComponent, 
      TextColorDirective, 
      CardComponent, 
      CardBodyComponent, 
      FormDirective, 
      InputGroupComponent, 
      InputGroupTextDirective, 
      IconDirective, 
      FormControlDirective, 
      ButtonDirective, 
      NgStyle,
    ]
})
export class LoginComponent implements OnInit {

  login: UntypedFormGroup
  acceder: boolean = false;

  errorCodes: Array<any> = [
    400,
    401,
    402,
    403,
    404,
    405,
    406
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private cookie: EncryptedCookieService,
    private toast: ToastrService
  ) { 
    this.login = this.fb.group(
      {
        email: ['', [Validators.required]],
        password: ['', [Validators.required]]
      },
      {  }
    );
  }

  ngOnInit(): void {
  }

  async onSubmit() {
    // const {
    //   email,
    //   password,
    // } = this.login.value;

    const dataLogin: Login = {...this.login.value}

    let apiResponse: HttpResponse = await this.loginPanel(dataLogin);
  
    if(apiResponse.success == true) {
      //gestion de cookies
      this.iniciarCookies(dataLogin, apiResponse);

      //Logueamos en API
      this.toast.success('👍 Redirigiendo al Panel de Control', '', {
        progressBar: true,
        timeOut: 1300
      });
      
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1350);
      

    }
  }

  /** Login para el usuario */
  private async loginPanel(data: Login) {
    let info: HttpResponse = await this.auth.asyncLoginPanel(data)
      .catch((err) => {
        // Extraer los mensajes de error
        const errorMessages = this.getErrorMessages(err.errors);

        if(!err.success && this.errorCodes.includes(err.code) ){
          this.cookie.deleteAllCookies();
          this.toast.error(errorMessages, 'Ha ocurrido un error al autenticarse', {
            progressBar: true,
            timeOut:1500,
          });
          return true;
        }
    
        if(!err.success && err.code == 200) {
          this.cookie.deleteAllCookies();
          this.toast.error(errorMessages, 'Ha ocurrido un error al autenticarse', {
            progressBar: true
          });
          return true;
        }
      });

    return info;
  }

  navigateToRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }

  private iniciarCookies(dataLogin: Login, apiResponse: HttpResponse) {
    dataLogin.login = true;      
    let loginUsuario = JSON.stringify(dataLogin);
    //sesión
    this.cookie.setEncryptedCookie(environment.auth_cookie, loginUsuario);
    //usuario
    this.cookie.setEncryptedCookie(environment.user_cookie, apiResponse.data.user);
    //token
    this.cookie.setEncryptedCookie(environment.api_token, apiResponse.data.token);
  }

  // Función para extraer y concatenar los mensajes de error
  getErrorMessages = (errors: { [key: string]: string[] }): string => {
    let errorMessages = "";
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errorMessages += errors[key].join(' ') + ' ';
      }
    }
    return errorMessages.trim();
  };
}
