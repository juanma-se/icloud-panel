import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertComponent,
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
import { NavigationService } from '@app/services/navigation.service';
import { Privilege } from './../../../models/user';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss',
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
    AlertComponent,
  ]
})
export class EditarUsuarioComponent implements OnInit {

  userId: string | null = null;
  userData: any = null;
  eventForm!: FormGroup

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private navService: NavigationService,
    private toast: ToastrService,
    private fb: FormBuilder,
  ) 
  {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.userData = this.navService.getNavigationData();
    console.log(this.userData, this.userId);
    // if(this.userData == null) {
    //   this.router.navigate(['/listar-usuarios']);
    // }
  }
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.userData = this.navService.getNavigationData();
    this.eventForm = this.fb.group(
      {
        role: new FormControl(this.userData?.privilege[0].role),
        name: new FormControl(this.userData?.name || '', Validators.required),
        email: new FormControl(this.userData?.email || '', [Validators.required, Validators.email])
      }
    );
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      console.log(this.eventForm.errors)
      return;
    }

    this.editarUsuario(this.userId);
  }

  private editarUsuario(id:any) {
    //
  }

}
