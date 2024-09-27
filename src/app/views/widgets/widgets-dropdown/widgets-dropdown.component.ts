import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  input
} from '@angular/core';
import { ButtonDirective, ColComponent, DropdownComponent, DropdownDividerDirective, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective, RowComponent, TemplateIdDirective, ThemeDirective, WidgetStatAComponent } from '@coreui/angular';
import { format, startOfMonth } from 'date-fns';

import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { UserService } from '@app/services/user.service';
import { getStyle } from '@coreui/utils';

@Component({
    selector: 'app-widgets-dropdown',
    templateUrl: './widgets-dropdown.component.html',
    styleUrls: ['./widgets-dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: true,
    imports: [
      RowComponent, 
      ColComponent, 
      WidgetStatAComponent, 
      TemplateIdDirective, 
      IconDirective, 
      ThemeDirective, 
      DropdownComponent, 
      ButtonDirective, 
      DropdownToggleDirective, 
      DropdownMenuDirective, 
      DropdownItemDirective, 
      RouterLink, 
      DropdownDividerDirective, 
      ChartjsComponent
    ]
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {

  // @Input() usuarios: number = 0;
  // @Input() eventos: number = 0;
  public primerDiaDelMes: string = format(startOfMonth(new Date()), 'yyyy-MM-dd 00:00:00');
  public fechaActual: string = format(new Date(), 'yyyy-MM-dd 00:00:00');

  usuarios: number = 0;
  documents: number = 0;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.obtnerDatos();
  }

  data: any[] = [];
  options: any[] = [];
  labels = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
    'Enero',
    'Febreo',
    'Marzo',
    'Abril'
  ];
  datasets = [
    [{
      label: 'Usuarios',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-primary'),
      pointHoverBorderColor: getStyle('--cui-primary'),
      data: [65, 59, 84, 84, 51, 55, 40]
    }], [{
      label: 'Eventos',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-info'),
      pointHoverBorderColor: getStyle('--cui-info'),
      data: [1, 18, 9, 17, 34, 22, 11]
    }], [{
      label: 'Suscripciones',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-warning'),
      pointHoverBorderColor: getStyle('--cui-warning'),
      data: [78, 81, 80, 45, 34, 12, 40],
      fill: true
    }], [{
      label: 'Suscripciones finalizadas',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
      barPercentage: 0.7
    }]
  ];
  optionsDefault = {
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        min: 30,
        max: 89,
        display: false,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      }
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  };

  ngOnInit(): void {
    this.setData();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  obtnerDatos(): void {
    this.activatedRoute.data.subscribe({
      next: (data: any) => {
        const result = data['dashboard'];
        this.usuarios = result.usuarios.length;
        this.documents = result.documents.length;     
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  setData() {
    for (let idx = 0; idx < 4; idx++) {
      this.data[idx] = {
        labels: idx < 3 ? this.labels.slice(0, 7) : this.labels,
        datasets: this.datasets[idx]
      };
    }
    this.setOptions();
  }

  setOptions() {
    for (let idx = 0; idx < 4; idx++) {
      const options = JSON.parse(JSON.stringify(this.optionsDefault));
      switch (idx) {
        case 0: {
          this.options.push(options);
          break;
        }
        case 1: {
          options.scales.y.min = -9;
          options.scales.y.max = 39;
          options.elements.line.tension = 0;
          this.options.push(options);
          break;
        }
        case 2: {
          options.scales.x = { display: false };
          options.scales.y = { display: false };
          options.elements.line.borderWidth = 2;
          options.elements.point.radius = 0;
          this.options.push(options);
          break;
        }
        case 3: {
          options.scales.x.grid = { display: false, drawTicks: false };
          options.scales.x.grid = { display: false, drawTicks: false, drawBorder: false };
          options.scales.y.min = undefined;
          options.scales.y.max = undefined;
          options.elements = {};
          this.options.push(options);
          break;
        }
      }
    }
  }
}
