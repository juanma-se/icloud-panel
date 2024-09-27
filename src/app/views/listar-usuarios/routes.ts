import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listar-usuarios.component').then(m => m.ListarUsuariosComponent),
    data: {
      title: 'Usuarios',
    }
  }
];