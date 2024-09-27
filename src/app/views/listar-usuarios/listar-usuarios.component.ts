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
import { CurrencyPipe, NgStyle, registerLocaleData } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, fromEvent, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { brandSet, flagSet, freeSet } from '@coreui/icons';

import { ADTSettings } from 'angular-datatables/src/models/settings';
import { ButtonTemplateRefComponent } from '@app/views/widgets/table-button/button-template-ref.component';
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
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.scss',
  providers: [IconSetService, CurrencyPipe,
    {
      provide: LOCALE_ID,
      useValue: 'es'
     },
     {
       provide: DEFAULT_CURRENCY_CODE,
       useValue: 'EUR'
     },
  ],
  standalone: true,
  imports: [DataTablesModule, CurrencyPipe, CalloutComponent, TextColorDirective, RouterLink, ContainerComponent, InputGroupComponent, CardComponent, CardBodyComponent,
    RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, SpinnerComponent,
    NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, CardHeaderComponent, TableDirective, FormsModule,
    InputGroupTextDirective, ButtonTemplateRefComponent],
})
export class ListarUsuariosComponent implements AfterViewInit, OnInit, OnDestroy {

  //dtOptionsSetting: DataTables.Settings = {};
  dtOptionsUsuarios: ADTSettings | DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  usuarios: Array<any> = [];
  isLoading: boolean = false;

  @ViewChild('buttonRef') 
  buttonRef!: TemplateRef<ButtonTemplateRefComponent>;

  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  public constructor(
    public userService: UserService,
    public router: Router,
    public iconSet: IconSetService,
    private toast: ToastrService,
    private navService: NavigationService,
    private confirmationService: ToastService
  ) {
    iconSet.icons = { ...freeSet, ...brandSet, ...flagSet };
  }

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe(() => this.rerender());
  }

  ngAfterViewInit() {
    const self = this;
    this.getUsers();

    this.dtTrigger.next(this.dtOptionsUsuarios);
  }

  private getUsers() {
    this.dtOptionsUsuarios = {
      ajax: (dataTablesParameters: any, callback: any) => {
        this.userService.getUsers()
        .pipe(untilDestroyed(this))
        .subscribe((response: any) => {
          response.forEach((user: any) => {
            user.tag_permissions = user.privilege[0].permissions.map((etiqueta: any) => 
              `<button class="btn btn-sm btn-success mx-1">${etiqueta}</button>`).join(' ');
          });
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
          title: 'Email',
          data: 'email'
        }, 
        {
          title: 'Nombre',
          data: 'name'
        },
        {
          title: 'Rol',
          data: 'privilege[0].role'
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
                    <td>Permisos:</td>
                    <td>${data.tag_permissions}</td>
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
        this.navService.setNavigationData(data);
        this.router.navigate([`/editar-usuario/${data.id}`]);
      break;
      case 'delete':
        this.confirmationService.confirm(
          '¿Estás seguro de que quieres borrar este usuario?',
          () => {
            this.toast.success('Simulación - Usuario eliminado correctamente');
                
            setTimeout(() => {
              this.rerender();
            }, 1550);
          },
          () => {
            console.log('Acción de borrado cancelada');
          }
        );
        break;
    }
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
}
