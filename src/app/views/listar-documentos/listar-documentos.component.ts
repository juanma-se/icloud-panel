import { AfterViewInit, Component, DEFAULT_CURRENCY_CODE, LOCALE_ID, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  ButtonDirective,
  ButtonGroupComponent,
  CalloutComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  ContainerComponent,
  FormCheckLabelDirective,
  GutterDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  SpinnerComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { CurrencyPipe, NgFor, NgStyle, registerLocaleData } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, fromEvent, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { brandSet, flagSet, freeSet } from '@coreui/icons';

import { ADTSettings } from 'angular-datatables/src/models/settings';
import { ButtonTemplateRefComponent } from '@app/views/widgets/table-button/button-template-ref.component';
import { DocumentService } from '@app/services/document.service';
import { default as ES } from 'datatables.net-plugins/i18n/es-ES.json';
import { IButtonComponentEventType } from '@app/interfaces/button-template-ref-event-type';
import { NavigationService } from '@app/services/navigation.service';
import { ToastService } from '@app/services/toast.service'
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@app/services/user.service';
import es from '@angular/common/locales/es';

registerLocaleData(es, 'es');

@UntilDestroy()
@Component({
  selector: 'app-listar-documentos',
  standalone: true,
  templateUrl: './listar-documentos.component.html',
  styleUrl: './listar-documentos.component.scss',
  imports: [DataTablesModule, CurrencyPipe, CalloutComponent, TextColorDirective, RouterLink, ContainerComponent, InputGroupComponent, CardComponent, CardBodyComponent,
    RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, SpinnerComponent,
    NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, CardHeaderComponent, TableDirective, FormsModule,
    InputGroupTextDirective, ButtonTemplateRefComponent, NgFor
  ],
  providers: [
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: LOCALE_ID, useValue: 'es' },
    CurrencyPipe,
  ]
})
export class ListarDocumentosComponent implements AfterViewInit, OnInit, OnDestroy {

  dtOptions: ADTSettings | DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  usuarios: Array<any> = [];
  isLoading: boolean = false;

  @ViewChild('buttonRef') 
  buttonRef!: TemplateRef<ButtonTemplateRefComponent>;

  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  errorCodes: Array<any> = [
    400,
    401,
    402,
    403,
    404,
    405,
    406
  ];

  public constructor(
    public documentService: DocumentService,
    public router: Router,
    private toast: ToastrService,
    private navService: NavigationService,
    private confirmationService: ToastService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const self = this;
    this.obtenerDocumentos();
    this.dtTrigger.next(this.dtOptions);
  }

  private obtenerDocumentos() {
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback: any) => {
        this.documentService.getDocuments()
        .pipe(untilDestroyed(this))
        .subscribe((response: any) => {
          callback({
            data: response ? response : []
          });
        });
      },
      pagingType: 'simple_numbers',
      pageLength: 25,
      dom: 'frtip',
      responsive: true,
      columns: [
        {
          className: 'dt-control',
          orderable: false,
          data: null,
          defaultContent: ''
        },
        {
          title: 'ID',
          data: 'id'
        },
        {
          title: 'Nombre',
          data: 'name'
        },
        {
          title: 'Descripción',
          data: 'description'
        },
        {
          title: 'Relevancia',
          data: 'relevance'
        },
        {
          title: 'Fecha Aprovación',
          data: 'approval_date'
        },
        {
          title: 'Acciones',
          defaultContent: '',
          ngTemplateRef: {
            ref: this.buttonRef,
            context: {
              // needed for capturing events inside <ng-template>
              captureEvents: this.onCaptureEvent.bind(this)
            }
          }
        }
      ],
      columnDefs: [
        { width: '5%', targets: 0 },
      ],
      language: ES,
      initComplete: () => {
        const table = $('#first-table').DataTable();

        $('#first-table tbody').on('click', 'td.dt-control', function () {
          const tr = $(this).closest('tr');
          const row = table.row(tr);
    
          if (row.child.isShown()) {
            // Cerrar la fila expandida
            row.child.hide();
            tr.removeClass('shown');
          } else {
            // Mostrar la fila expandida con detalles adicionales
            row.child(function(data: any) {
              return `
                <table class="row-border hover cell-border table-striped table">
                  <tr>
                    <td>Fecha de Aprovación:</td>
                    <td>${data.approval_date}</td>
                  </tr>
                  <tr>
                    <td>Fecha de subida:</td>
                    <td>${data.upload_date}</td>
                  </tr>
                  <tr>
                    <td>PDF:</td>
                    <td><a type="button" class="btn btn-primary" href="${data.pdf_path}" target="_blank">Descargar</a></td>
                  </tr>
                </table>
              `;
            }(row.data())).show();
            tr.addClass('shown');
          }
        });
      }
    };
  }

  onCaptureEvent(event: IButtonComponentEventType) {
    const { cmd, data, action } = event;

    switch (action) {
      case 'edit':
        this.router.navigate([`/editar-documento/${data.id}`]);
        break;
      case 'delete':
        this.confirmationService.confirm(
          '¿Estás seguro de que quieres borrar este documento?',
          () => {
            // Acción de confirmación
            this.proccessDelete(data.id);
          },
          () => {
            // Acción de cancelación
            console.log('Acción de borrado cancelada');
          }
        );
        break;
    }
  }

  proccessDelete(id: string): void {
    this.documentService.deleteDocument(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next:(data) => {
          if(data.success == true) {
            this.toast.success('Documento eliminado correctamente', '', {
              progressBar: true,
              timeOut: 1200,
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
            if(err.data != undefined && err.data.length !== 0) {
              // Extraer los mensajes de error
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

  rerender(): void {
    this.dtElement.dtInstance.then(dtInstance => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger?.unsubscribe();
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
