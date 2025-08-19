import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';
import { Product } from '../../services/product';
import { Vehicle } from '../../services/vehicle';
import { VehicleForm } from '../../shared/interfaces/vehicle.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-a-agregar-producto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalConfirmacion],
  templateUrl: './a-agregar-producto.html',
  styleUrl: './a-agregar-producto.scss'
})
export class AAgregarProducto implements OnInit{

  vehicles$!: Observable<VehicleForm[]>;

  productoForm: FormGroup;
  isEditMode = false;
  productoId?: number;
  nameOfUser: string | null = null;
  // nameOfUser: string = sessionStorage.getItem('userName') || '';
  titleModalExito: string = "";

  typeError: string | null = null;
  showError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: Product,
    private route: ActivatedRoute,
    private vehicleService: Vehicle,
    private cd: ChangeDetectorRef,
  ) {
    this.productoForm = this.fb.group({
      name: ['', Validators.required],
      type_vehicle_id: [null, Validators.required],
      spec_sheet_url: [''],
      code: [null, Validators.required],
      type_unit: ['Tm', Validators.required],
    });

  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.nameOfUser = sessionStorage.getItem('userName');
    }

    this.vehicles$ = this.vehicleService.vehicles$;
    this.vehicleService.getVehicles();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productoId = +id;

        this.productService.getProductById(this.productoId).subscribe(product => {
          this.productoForm.patchValue(product);
        });
      }
    });

    this.titleModalExito = this.isEditMode ? 'Se actualizó el producto con éxito' : 'Se agregó el producto con éxito';

    this.vehicleService.getVehicles();
  }


  mostrarModalExito: boolean = false;

  submit() {

    this.showError = false;
    this.typeError = null;
    this.cd.detectChanges();

    if (this.productoForm.valid) {
      const payload = {
        name: this.productoForm.value.name,
        type_vehicle_id: this.productoForm.value.type_vehicle_id,
        // type_vehicle: {  
        // },
        code: this.productoForm.value.code,
        type_unit: this.productoForm.value.type_unit,
        spec_sheet_url: this.productoForm.value.spec_sheet_url,
      };

      const action = this.isEditMode
        ? this.productService.updateProduct(this.productoId!, payload)
        : this.productService.createProduct(payload);

      action.subscribe({
        next: (res) => {
          console.log('guardado:', res);
          console.log(this.isEditMode ,this.titleModalExito);
          this.mostrarModalExitoso();
          this.cd.detectChanges();
        },
        error: (err) => {
          this.showError = true;
          this.typeError = err.error?.message || 'Hubo un error, revisa tus datos.';
          this.cd.detectChanges();

          console.error('Error al guardar el producto', err);
        }
      });

    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  // MODAL DE ÉXITO

  mostrarModalExitoso() {
    this.mostrarModalExito = true;
  }

  irAListaProductos() {
    this.mostrarModalExito = false;
    this.router.navigate(['/admin/lista-productos']);
  }

  // Ficha técnica

  // onArchivoSeleccionado(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const archivo = input.files[0];

  //     if (archivo.type === 'application/pdf') {
  //       this.productoForm.patchValue({
  //         fichatecnica: archivo
  //       });
  //       this.productoForm.get('fichatecnica')?.updateValueAndValidity();
  //     } else {
  //       console.error('El archivo no es un PDF');
  //     }
  //   }
  // }

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
// Cal Viva Molida	Granel	Portasilo (Bombona)    +
// Cal Viva Molida	En Big Bag	Plataforma
// Cal Hidratada	Granel	Portasilo (Bombona)
// Cal Hidratada	En Big Bag	Plataforma
// Cal Gruesa	Granel	Tolva Hidraulica
// Cal Sanitaria	En Big Bag	Plataforma
