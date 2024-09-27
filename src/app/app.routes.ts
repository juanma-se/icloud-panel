import { DashboardResolver } from '@app/resolvers/dashboard.resolver';
import { DefaultLayoutComponent } from './layout';
import { LoginGuard } from '@app/guards/login.guard'
import { ReturnDashboardGuard } from '@app/guards/return-dashboard.guard'
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Inicio'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes),
        canActivate: [LoginGuard],
        resolve: {
          dashboard: DashboardResolver,
        }
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'listar-usuarios',
        loadChildren: () => import('./views/listar-usuarios/routes').then((m) => m.routes),
        canActivate: [LoginGuard],
      },
      {
        path: 'crear-usuario',
        loadChildren: () => import('./views/crear-usuario/routes').then((m) => m.routes),
        canActivate: [LoginGuard],
      },
      {
        path: 'editar-usuario',
        loadChildren: () => import('./views/editar-usuario/routes').then((m) => m.routes),
        canActivate: [LoginGuard],
      },
      {
        path: 'listar-documentos',
        loadChildren: () => import('./views/listar-documentos/routes').then((m) => m.routes),
        canActivate: [LoginGuard],
      },
      {
        path: 'editar-documento/:id',
        loadChildren: () => import('./views/editar-documento/routes').then((m) => m.routes),
        canActivate: [LoginGuard],
        resolve: {
          dashboard: DashboardResolver,
        }
      },
      {
        path: 'crear-documento',
        loadChildren: () => import('./views/crear-documento/routes').then((m) => m.routes),
        canActivate: [LoginGuard],
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [],
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
