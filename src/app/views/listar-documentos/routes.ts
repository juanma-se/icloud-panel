import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listar-documentos.component').then(m => m.ListarDocumentosComponent),
    data: {
      title: 'Documentos',
    }
  }
];