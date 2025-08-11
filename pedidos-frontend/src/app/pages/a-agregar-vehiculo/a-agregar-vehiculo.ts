import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';
import { Vehicle } from '../../services/vehicle';
import { of } from 'rxjs';

@Component({
  selector: 'app-a-agregar-vehiculo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalConfirmacion],
  templateUrl: './a-agregar-vehiculo.html',
  styleUrl: './a-agregar-vehiculo.scss'
})
export class AAgregarVehiculo implements OnInit{

  vehicleForm: FormGroup;
  isEditMode = false;
  vehicleId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private vehicleService: Vehicle,
  ) {
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.vehicleId = +id;

        this.vehicleService.getVehicleById(this.vehicleId).subscribe(vehicle => {
          this.vehicleForm.patchValue(vehicle);
        });
      }
    });
  }


  mostrarModalExito:boolean = false;

  submit() {
    if (this.vehicleForm.valid) {
      const v = {
        name: this.vehicleForm.value.name,
        code: this.vehicleForm.value.code,
      };

      const action = this.isEditMode 
        ? this.vehicleService.updateVehicle(this.vehicleId!, v) // <-- Llama a update
        : this.vehicleService.createVehicle(v);

      action.subscribe({
        next: (res) => {
          console.log('guardado:', res);
        },
        error: (err) => {
          console.error('Error al guardar el vehículo', err);
        }
      });

      this.mostrarModalExitoso();

    } else {
      this.vehicleForm.markAllAsTouched();
    }
  }

  // MODAL DE ÉXITO

  mostrarModalExitoso() {
    this.mostrarModalExito = true;
  }

  irAListaVehiculos() {
    this.mostrarModalExito = false;
    this.router.navigate(['/admin/lista-vehiculos']);
  }


  // MODAL DE CONFIRMACIÓN

  mostrarModalConfirmacion = false;

  volverListaVehiculos() {
    if (this.vehicleForm.dirty || this.vehicleForm.touched) {
      this.mostrarModalConfirmacion = true;
    } else {
      this.router.navigate(['/admin/lista-vehiculos']);
    }
  }

  confirmarVolver() {
    this.mostrarModalConfirmacion = false;
    this.router.navigate(['/admin/lista-vehiculos']);
  }

  cancelarVolver() {
    this.mostrarModalConfirmacion = false;
  }


}
