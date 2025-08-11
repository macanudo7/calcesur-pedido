import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';

@Component({
  selector: 'app-a-agregar-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalConfirmacion],
  templateUrl: './a-agregar-usuario.html',
  styleUrl: './a-agregar-usuario.scss'
})
export class AAgregarUsuario {

  productoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.productoForm = this.fb.group({
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      observaciones: [''],
      productosSolicitados: ['', Validators.required],
      ccCorreos: ['', Validators.required],
      password: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      typeuser: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  submit() {
    if (this.productoForm.valid) {
      console.log('Producto enviado:', this.productoForm.value);

    } else {
      this.productoForm.markAllAsTouched();
    }
  }


  // MODAL DE CONFIRMACIÓN

  mostrarModalConfirmacion = false;

  volverListaProductos() {
    if (this.productoForm.dirty || this.productoForm.touched) {
      console.log('Mostrando modal de confirmación');
      this.mostrarModalConfirmacion = true;
    } else {
      console.log('Mostrando aaaaaaaaa');
      this.router.navigate(['/admin/lista-usuarios']);
    }
  }

  confirmarVolver() {
    this.mostrarModalConfirmacion = false;
    this.router.navigate(['/admin/lista-usuarios']);
  }

  cancelarVolver() {
    this.mostrarModalConfirmacion = false;
  }

}
