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
  NavItemComponent,
  NavLinkDirective,
  RowComponent,
  TextColorDirective,
} from '@coreui/angular';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { NgClass, NgIf, NgStyle } from '@angular/common';

import { AuthService } from '@app/services/auth.service';
import { EncryptedCookieService } from '@app/services/encrypted-cookie.service';
import { HttpResponse } from '@models/http-response';
import { IconDirective } from '@coreui/icons-angular';
import { Register } from '@models/register';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { confirmPasswordValidator } from '@app/validators/confirm-password.validator';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [
      NgIf,
      NgClass,
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
      NavItemComponent,
      NavLinkDirective,
      NgStyle,
    ]
})
export class RegisterComponent implements OnInit {

  strongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  register: UntypedFormGroup

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
    this.register = this.fb.group(
      {
        nombre: ['', [Validators.required]],
        email: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.pattern(this.strongPasswordRegx)]],
        passwordConfirmation: ['', [Validators.required]],
      },
      {validators: confirmPasswordValidator}
    );
  }

  ngOnInit(): void {
  }

  get passwordFormField() {
    return this.register.get('password');
  }

  async onSubmit() {
    const {
      nombre,
      email,
      password,
    } = this.register.value;

    const data: Register = {
      nombre,
      email,
      password,
      password_confirmation: password
    }

    let info: HttpResponse = await this.solicitarRegistroPanel(data);
    console.log(info);

    if(info.success == true) {
      //Registramos en API
      this.toast.success('👍 Ya puedes iniciar sesión', '', {
        progressBar: true,
        timeOut: 1300
      });
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1350);
      

    }
  }

  navigateToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }

  /** Registro para el usuario */
  private async solicitarRegistroPanel(data: Register) {
    let info: HttpResponse = await this.auth.asyncRegisterPanel(data)
      .catch((err) => {
        // Extraer los mensajes de error
        const errorMessages = this.getErrorMessages(err.errors);

        if(!err.success && this.errorCodes.includes(err.code) ){
          this.toast.error(errorMessages, 'Ha ocurrido un error al registrarse', {
            progressBar: true,
            timeOut:1500,
          });
          return true;
        }
    
        if(!err.success && err.code == 200) {
          this.toast.error(errorMessages, 'Ha ocurrido un error al registrarse', {
            progressBar: true
          });
          return true;
        }
      });

    return info;
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
