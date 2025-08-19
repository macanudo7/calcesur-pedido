import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';
import { Vehicle } from '../../services/vehicle';

@Component({
  selector: 'app-a-agregar-vehiculo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalConfirmacion],
  templateUrl: './a-agregar-vehiculo.html',
  styleUrl: './a-agregar-vehiculo.scss'
})
export class AAgregarVehiculo implements OnInit {

  vehicleForm: FormGroup;
  isEditMode = false;
  vehicleId?: number;
  nameOfUser: string = sessionStorage.getItem('userName') || '';
  titleModalExito: string = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private vehicleService: Vehicle,
    private cd: ChangeDetectorRef,
  ) {
    // Inicializar el formulario
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
    });

    // Verificar si hay token
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/ingreso']);
      return;
    };


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

    this.titleModalExito = this.isEditMode ? 'Se actualizó el vehículo con éxito' : 'Se agregó el vehículo con éxito';
  }


  mostrarModalExito: boolean = false;

  submit() {
    if (this.vehicleForm.valid) {
      const v = {
        name: this.vehicleForm.value.name,
        code: this.vehicleForm.value.code,
      };

      const action = this.isEditMode
        ? this.vehicleService.updateVehicle(this.vehicleId!, v)
        : this.vehicleService.createVehicle(v);

      action.subscribe({
        next: (res) => {
          console.log('guardado:', res);
          console.log(this.isEditMode ,this.titleModalExito);
          this.mostrarModalExitoso();
        },
        error: (err) => {
          console.error('Error al guardar el vehículo', err);
        }
      });

    } else {
      this.vehicleForm.markAllAsTouched();
    }
  }

  // MODAL DE ÉXITO

  mostrarModalExitoso() {
    this.mostrarModalExito = true;
    this.cd.detectChanges();
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
