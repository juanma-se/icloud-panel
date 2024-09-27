import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  ContainerComponent,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { Component, OnInit } from '@angular/core';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { brandSet, flagSet, freeSet } from '@coreui/icons';

import { ChartData } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { DocumentService } from '@app/services/document.service';
import { NgStyle } from '@angular/common';
import { UserService } from '@app/services/user.service';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';

@Component({
  templateUrl: 'dashboard.component.html',
  providers: [IconSetService],
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    WidgetsDropdownComponent, 
    TextColorDirective, 
    RouterLink, 
    ContainerComponent, 
    CardComponent, 
    CardBodyComponent, 
    RowComponent, 
    ColComponent, 
    ButtonDirective, 
    IconDirective, 
    ButtonGroupComponent, 
    ChartjsComponent, 
    NgStyle, 
    CardFooterComponent, 
    GutterDirective, 
    ProgressBarDirective, 
    ProgressComponent, 
    CardHeaderComponent, 
    TableDirective, 
    AvatarComponent
  ]
})
export class DashboardComponent implements OnInit {

  usuarios: any;
  documentos: any;
  
  options = {
    maintainAspectRatio: false
  };

  chartLineData: ChartData | undefined

  chartLineOptions = {
    maintainAspectRatio: false
  };

  chartDoughnutData: ChartData | undefined;

  months = ['Enero', 'Febrero', 'MArzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  public constructor(
    public userService: UserService,
    public documentService: DocumentService,
    public iconSet: IconSetService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    iconSet.icons = { ...freeSet, ...brandSet, ...flagSet };
  }

  ngOnInit(): void {
    this.obtnerDatos();
    this.donutGraphics();
    this.lineGraphics();
  }

  obtnerDatos(): void {
    this.activatedRoute.data.subscribe({
      next: (data: any) => {
        const result = data['dashboard'];
        this.usuarios = result.usuarios.data;
        this.documentos = result.documents; 
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  donutGraphics() {
    this.documentService.relevanceStats().subscribe({
      next: (data: any) => {
        if(data.success) {
          const relevanceLevels = data.data.map((level: any) => level.relevance);
          const relevanceData = data.data.map((level: any) => level.total);

          this.chartDoughnutData = {
            labels: [...relevanceLevels],
            datasets: [
              {
                data: [...relevanceData],
                backgroundColor: ['#6f42c1', '#0d6efd', '#ffc107'],
                hoverBackgroundColor: ['#6e42c155', '#0d6dfd65', '#ffc10757']
              }
            ]
          };
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  lineGraphics() {
    this.documentService.monthlyStats().subscribe({
      next: (data: any) => {
        if(data.success) {
          const years = data.data.map((level: any) => level.year);
          const monthsNumbers = data.data.map((level: any) => level.month);
          const total = data.data.map((level: any) => level.total);

          this.chartLineData = {
            labels: [...this.getMonths(monthsNumbers)],
            datasets: [
              {
                label: 'Aprovados',
                backgroundColor: '#0d6dfd4b',
                borderColor: '#6710f241',
                pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                pointBorderColor: '#6f42c1',
                data: [...total]
              }
            ]
          };
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  private getMonths(monthsNumbers: number[]) {
    const monthDictionary: string[] = [];
    const monthsNames = this.months;
    monthsNumbers.forEach((number, index) => {
      monthDictionary[number] = monthsNames[index];
    });
    return Object.values(monthDictionary);
  }
}
