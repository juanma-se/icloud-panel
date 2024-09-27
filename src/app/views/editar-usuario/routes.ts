import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./editar-usuario.component').then(m => m.EditarUsuarioComponent),
    data: {
      title: 'Usuarios',
    }
  }
];