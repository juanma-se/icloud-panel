import { DashboardResolver } from '@app/resolvers/dashboard.resolver';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./editar-documento.component').then(m => m.EditarDocumentoComponent),
    data: {
      title: 'Documento',
    },
  }
];