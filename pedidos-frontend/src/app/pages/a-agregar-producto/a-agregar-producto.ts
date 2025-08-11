import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';
import { Product } from '../../services/product';
import { ProductoForm } from '../../shared/interfaces/productos.interface';

@Component({
  selector: 'app-a-agregar-producto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalConfirmacion],
  templateUrl: './a-agregar-producto.html',
  styleUrl: './a-agregar-producto.scss'
})
export class AAgregarProducto {

  productoForm: FormGroup;

  vehiculos = [
    { id: 1, nombre: 'Portasilo (Bombona)' },
    { id: 2, nombre: 'Plataforma' },
    { id: 3, nombre: 'Tolva Hidráulica' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: Product
  ) {
    this.productoForm = this.fb.group({
      name: ['', Validators.required],
      type_vehicle_id: [null, Validators.required],
      // fichatecnica: [null, Validators.required],
      code: [null, Validators.required],
      type_unit: ['', Validators.required],
    });

  }

  submit() {
    if (this.productoForm.valid) {
      const payload = {
        name: this.productoForm.value.name as String,
        type_vehicle_id: Number(this.productoForm.value.type_vehicle_id),
        code: Number(this.productoForm.value.code),
        type_unit: this.productoForm.value.type_unit as String,
      };

      console.log('Payload a enviar:', payload);

      this.productService.createProduct(payload).subscribe({
        next: (res) => {
          console.log('Producto guardado:', res);
          this.router.navigate(['/admin/lista-productos']);
        },
        error: (err) => {
          console.error('Error al guardar el producto', err);
        }
      });

    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  // Ficha técnica

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];

      if (archivo.type === 'application/pdf') {
        this.productoForm.patchValue({
          fichatecnica: archivo
        });
        this.productoForm.get('fichatecnica')?.updateValueAndValidity();
      } else {
        console.error('El archivo no es un PDF');
      }
    }
  }

  // MODAL DE CONFIRMACIÓN

  mostrarModalConfirmacion = false;

  volverListaProductos() {
    if (this.productoForm.dirty || this.productoForm.touched) {
      this.mostrarModalConfirmacion = true;
    } else {
      this.router.navigate(['/admin/lista-productos']);
    }
  }

  confirmarVolver() {
    this.mostrarModalConfirmacion = false;
    this.router.navigate(['/admin/lista-productos']);
  }

  cancelarVolver() {
    this.mostrarModalConfirmacion = false;
  }

}

// Cal Viva Granulada	Granel	Portasilo (Bombona)
// Cal Viva Granulada	En Big Bag	Plataforma
// Cal Viva Molida	Granel	Portasilo (Bombona)
// Cal Viva Molida	En Big Bag	Plataforma
// Cal Hidratada	Granel	Portasilo (Bombona)
// Cal Hidratada	En Big Bag	Plataforma
// Cal Gruesa	Granel	Tolva Hidraulica
// Cal Sanitaria	En Big Bag	Plataforma
