import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Escritorio',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    title: true,
    name: 'Gestion Usuarios'
  },
  {
    name: 'Usuarios',
    iconComponent: { name: 'cil-user' },
    children: [
      {
        name: 'Listar usuarios',
        url: '/listar-usuarios',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Crear usuarios',
        url: '/crear-usuario',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Gestion Documental'
  },
  {
    name: 'Documentos',
    iconComponent: { name: 'cil-calendar' },
    children: [
      {
        name: 'Listar documentos',
        url: '/listar-documentos',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Crear documento',
        url: '/crear-documento',
        icon: 'nav-icon-bullet'
      }
    ]
  }
];
