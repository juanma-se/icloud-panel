import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  FormFloatingDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  TextColorDirective
} from '@coreui/angular';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { IconDirective } from '@coreui/icons-angular';
import { Router } from '@angular/router';
import { ToastService } from '@app/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@app/services/user.service';
import { confirmPasswordValidator } from '@app/validators/confirm-password.validator';

@UntilDestroy()
@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.scss',
  imports: [
    NgIf,
    NgClass,
    FormFloatingDirective,
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
export class CrearUsuarioComponent implements OnInit {

  userData: any = null;
  createForm!: FormGroup
  selectedFile: File | null = null;
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
  previsualizarUrl: string | null = null;

  strongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  constructor( 
    private router: Router,
    private toast: ToastrService,
    private fb: FormBuilder,
    private confirmationService: ToastService
  ) 
  {}
  ngOnInit(): void {
    this.createForm = this.fb.group(
      {
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.pattern(this.strongPasswordRegx)]),
        passwordConfirmation: new FormControl('', Validators.required),
      },
      {validators: confirmPasswordValidator}
    );
  }

  get passwordFormField() {
    return this.createForm.get('password');
  }

  onSubmit() {
    if (this.createForm.invalid) {
      console.log(this.createForm.errors)
      return;
    }

    const { name, email, password } = this.createForm.value;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', password);

    this.createUser(formData);
  }

  private createUser(formData:FormData) {
    this.confirmationService.create(
      'Simulación de creación de usuario y se regresa a la lista de usuarios',
      () => {
        // Acción de confirmación
        this.router.navigate(['/listar-usuarios']);
      },
      () => {
        // Acción de cancelación
        console.log('Acción de creación cancelada');
      }
    );
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
