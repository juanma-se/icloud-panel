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
  Validators
} from '@angular/forms';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { DocumentService } from '@app/services/document.service';
import { ErrorMessages } from '@app/error-messages/error-messages';
import { IconDirective } from '@coreui/icons-angular';
import { NavigationService } from '@app/services/navigation.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '@models/user';

@UntilDestroy()

@Component({
  selector: 'app-editar-documento',
  standalone: true,
  templateUrl: './editar-documento.component.html',
  styleUrl: './editar-documento.component.scss',
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
export class EditarDocumentoComponent implements AfterViewInit, OnInit {

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
  user!: User;
  customValidated = false;
  submit: boolean = false;
  eventForm!: FormGroup
  documentData: any;
  documentId: any;
  previsualizarPdf: string | null = null;
  selectedFile: File | null = null;
  relevances: string[] = [
    'alta',
    'media',
    'baja'
  ];

  constructor(
    private router: Router,
    private navService: NavigationService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private documentService: DocumentService,
    private errorMessages: ErrorMessages,
    private activatedRoute: ActivatedRoute
  ) 
  {
    this.activatedRoute.data.subscribe({
      next: (data: any) => {
        this.activatedRoute.paramMap.subscribe(paramMap => {
          this.documentId = paramMap.get('id');
        });
        const documents = data['dashboard']['documents'];
        if(documents.length > 0) {
          this.documentData = documents.find((doc: any) => {
            return doc.id == this.documentId
          });
        }else {
          this.toast.success('Ha ocurrido un error al recuperar el documento', '', {
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
      error: (err: any) => {
        console.log("errr",err)
        if(!err.success && this.errorCodes.includes(err.code) ) {
          if(err.data.length !== 0) {
            // Extraer los mensajes de error
            const errorMessages = this.getErrorMessages(err.data);
            this.toast.error(errorMessages, '', {
              progressBar: true,
              timeOut:1500,
            });
            setTimeout(
              () => {
                this.router.navigate(['/listar-documentos']);
              }, 1550,
            );
          }
          this.toast.error(err.message, '', {
            progressBar: true,
            timeOut:1500,
          });
          setTimeout(
            () => {
              this.router.navigate(['/listar-documentos']);
            }, 1550,
          );
        }
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.populateFormData();
  }

  ngAfterViewInit(): void {
  }

  initializeForm(): void {
    this.eventForm = this.fb.group({
      name: [''],
      description: [''],
      relevance: [''],
      approval_date: [''],
      upload_date: [''],
      pdf_path: [''],
    });
  }

  populateFormData(): void {
    if(this.documentData) {

      const splitApproval: any = this.documentData.approval_date.split(' ')[0].split('-');
      const approval = this.documentData.approval_date ? new Date(splitApproval[2], splitApproval[1]-1, splitApproval[0]) : null;

      const splitUpload: any = this.documentData.upload_date.split(' ')[0].split('-');
      const upload = this.documentData.upload_date ? new Date(splitUpload[2], splitUpload[1]-1, splitUpload[0]) : null;
      
      this.eventForm.patchValue({
        name: this.documentData.name,
        description: this.documentData.description || '',
        relevance: this.documentData.relevance,
        approval_date: approval?.toISOString().split('T')[0],
        upload_date: upload?.toISOString().split('T')[0],
        pdf_path: this.documentData.pdf_path,
      });

      // Previsualizar la imagen si existe
      // if(this.documentData.pdf_path) {
      //   this.previsualizarPdf = this.documentData.pdf_path;
      //   this.eventForm.get('pdf_path')?.clearValidators();
      // }else {
      //   this.eventForm.get('pdf_path')?.setValidators(Validators.required);
      // }
      // this.eventForm.get('pdf_path')?.updateValueAndValidity();
    }
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
      approval_date,
      upload_date,
    } = this.eventForm.value;

    let formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('relevance', relevance);
    formData.append('approval_date', approval_date);
    formData.append('upload_date', upload_date);
    // if (this.selectedFile) {
    //   formData.append('pdf_path', this.selectedFile, 'doc-pdf');
    // }

    this.updateDocument(this.documentId, formData);
  }

  updateDocument(id: String, formData:FormData) {
    this.submit = true;
    this.documentService.updateDocument(id, formData).subscribe({
      next:(data) => {
        if(data.success == true) {
          this.toast.success(data.message, '', {
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
        if(!err.success && this.errorCodes.includes(err.code) ){
          if((err.data !== undefined) && err.data.isArray() && err.data.length !== 0) {
            // Extraer los mensajes de error
            const errorMessages = this.getErrorMessages(err.data);
            this.submit = false;
            return this.toast.error(errorMessages, '', {
              progressBar: true,
              timeOut:1500,
            });
          }
          if(err.message !== '') {
            this.submit = false;
            return this.toast.error(err.message, '', {
              progressBar: true,
              timeOut:1500,
            });
          }
        }
        this.toast.error('Error inesperado', '', {
          progressBar: true,
          timeOut:1500,
        });
        setTimeout(
          () => {
            this.router.navigate(['/listar-documentos']);
          }, 1550,
        );
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];

    if(file) {
      this.selectedFile = file;
      this.previsualizarPdf = URL.createObjectURL(file);
    }
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
