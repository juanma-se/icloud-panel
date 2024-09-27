import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import {
  AlertComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormControlDirective,
  FormDirective,
  FormFeedbackComponent,
  FormFloatingDirective,
  FormLabelDirective,
  FormSelectDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ListGroupItemDirective,
  RowComponent,
  TextColorDirective,
} from '@coreui/angular';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { DocumentService } from '@app/services/document.service';
import { ErrorMessages } from '@app/error-messages/error-messages';
import { IconDirective } from '@coreui/icons-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from '@models/user';

@UntilDestroy()
@Component({
  selector: 'app-crear-documento',
  standalone: true,
  templateUrl: './crear-documento.component.html',
  styleUrl: './crear-documento.component.scss',
  imports: [
    NgFor,
    NgIf,
    NgClass,
    NgStyle,
    FormsModule,
    FormFloatingDirective,
    ContainerComponent, 
    FormsModule, 
    ReactiveFormsModule, 
    RowComponent, 
    ColComponent, 
    CardGroupComponent, 
    TextColorDirective, 
    CardComponent,
    FormLabelDirective,
    FormFeedbackComponent,
    FormSelectDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    ListGroupItemDirective, 
    CardBodyComponent, 
    FormDirective, 
    InputGroupComponent, 
    InputGroupTextDirective, 
    IconDirective, 
    FormControlDirective, 
    ButtonDirective,
    AlertComponent,
  ]
})
export class CrearDocumentoComponent implements OnInit {

  eventForm!: FormGroup
  selectedFile: File | null = null;
  errorCodes: Array<any> = [
    400,
    401,
    402,
    403,
    404,
    405,
    406,
    422,
    500,
    501
  ];
  previsualizarUrl: string | null = null;
  user!: User;
  customValidated = false;
  submit: boolean = false;
  relevances: string[] = [
    'alta',
    'media',
    'baja'
  ];

  constructor(
    private router: Router,
    private toast: ToastrService,
    private fb: FormBuilder,
    private documentService: DocumentService,
    private errorMessages: ErrorMessages
  ) 
  {}
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      relevance: ['', Validators.required],
      pdf_path: ['', Validators.required],
    });
  }
  
  onSubmit(): void {
    if(this.eventForm.invalid) {      
      this.customValidated = true;      
      this.errorMessages.showErrorMessages(this.eventForm);      
      return;
    }

    const {
      name,
      description,
      relevance,
    } = this.eventForm.value;

    let formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('relevance', relevance);
    if (this.selectedFile) {
      formData.append('pdf_file', this.selectedFile, 'doc-pdf');
    }

    this.createDocument(formData);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
    }
  }

  private createDocument(formData:FormData) {
    this.submit = true;
    this.documentService.createDocument(formData).subscribe({
      next:(data) => {
        if(data.success == true) {
          this.toast.success('El documento se ha creado correctamente', '', {
            progressBar: true,
            timeOut: 1500,
          });
          setTimeout(
            () => {
              this.router.navigate(['/listar-documentos']);
            }, 1550,
          );
        }
      },
      error:(err) => {
        this.submit = false;
        if(!err.success && this.errorCodes.includes(err.code) ){
          if(err.data != undefined && err.data.length !== 0) {
            const errorMessages = this.getErrorMessages(err.data);
            return this.toast.error(errorMessages, '', {
              progressBar: true,
              timeOut:1500,
            });
          }
          return this.toast.error(err.message, '', {
            progressBar: true,
            timeOut:1500,
          });
        }
      }
    });
  }

  // Función para extraer y concatenar los mensajes de error
  getErrorMessages = (errors: { [key: string]: string[] }): string => {
    console.log(errors);
    let errorMessages = "";
    for (const key in errors) {
      console.log(key, errors[key]);
      if (errors.hasOwnProperty(key)) {
        errorMessages += errors[key].join(' ') + ' ';
      }
    }
    return errorMessages.trim();
  };
}
