import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./widgets/widgets.component').then(m => m.WidgetsComponent),
    data: {
      title: 'Widgets'
    }
  },
  {
    path: '',
    loadComponent: () => import('./table-button/button-template-ref.component').then(m => m.ButtonTemplateRefComponent),
    data: {
      title: 'table-buttons'
    }
  }
];
