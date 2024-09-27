import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  confirm(
    message: string, 
    onConfirm: () => void, 
    onCancel: () => void
  ): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1b9e3e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm(); // Ejecutar la función de confirmación
      } else if (result.isDismissed) {
        onCancel(); // Ejecutar la función de cancelación
      }
    });
  }

  create(
    message: string, 
    onConfirm: () => void, 
    onCancel: () => void
  ): void {
    Swal.fire({
      title: 'Confirmación',
      text: message,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#1b9e3e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm(); // Ejecutar la función de confirmación
      } else if (result.isDismissed) {
        onCancel(); // Ejecutar la función de cancelación
      }
    });
  }
}
