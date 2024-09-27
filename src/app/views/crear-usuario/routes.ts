import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./crear-usuario.component').then(m => m.CrearUsuarioComponent),
    data: {
      title: 'Usuarios',
    }
  }
];