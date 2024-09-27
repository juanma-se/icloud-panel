import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./crear-documento.component').then(m => m.CrearDocumentoComponent),
    data: {
      title: 'Documentos',
    }
  }
];