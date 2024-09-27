import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
	providedIn: 'root',
})
export class ErrorMessages {
	constructor(private toastr: ToastrService) { }

	showErrorMessages(form: FormGroup) {

    const result: { control: string; error: string; value: any; }[] = [];
    Object.keys(form.controls).forEach(key => {  
      const controlErrors: any = form.get(key)?.errors;      
	  if(controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            'control': key,
            'error': keyError,
            'value': controlErrors[keyError]
          });
        });
      }
    })

	result.forEach((error) => {
		if (error.value) {
			if(error.control === 'foto_portada') {
				form.get(error.control)!.setErrors({ 'incorrect': true });
				this.toastr.error('El campo foto es requerido', '', {
					progressBar: true,
					timeOut: 2000,
				});
			}else if(error.control === 'fecha') {
				form.get(error.control)!.setErrors({ 'incorrect': true });
				this.toastr.error('El campo fecha de inicio es requerido', '', {
					progressBar: true,
					timeOut: 2000,
				});
			}else if(error.control === 'hora_inicio') {
				form.get(error.control)!.setErrors({ 'incorrect': true });
				this.toastr.error('El campo hora de inicio es requerido', '', {
					progressBar: true,
					timeOut: 2000,
				});
			}else if(error.control === 'fecha_final') {
				form.get(error.control)!.setErrors({ 'incorrect': true });
				this.toastr.error('El campo fecha de finalización es requerido', '', {
					progressBar: true,
					timeOut: 2000,
				});
			}else if(error.control === 'hora_final') {
				form.get(error.control)!.setErrors({ 'incorrect': true });
				this.toastr.error('El campo hora de finalización es requerido', '', {
					progressBar: true,
					timeOut: 2000,
				});
			}else {
				form.get(error.control)!.setErrors({ 'incorrect': true });
				this.toastr.error(`El campo ${error.control} es requerido`, '', {
					progressBar: true,
					timeOut: 2000,
				});
			}
		}
	});
  }
}