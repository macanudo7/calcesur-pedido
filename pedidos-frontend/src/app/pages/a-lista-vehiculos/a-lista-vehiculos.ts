import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Vehicle } from '../../services/vehicle';
import { VehicleForm } from '../../shared/interfaces/vehicle.interface';
import { Observable } from 'rxjs';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';


@Component({
  selector: 'app-a-lista-vehiculos',
  standalone: true,
  imports: [CommonModule, ModalConfirmacion],
  templateUrl: './a-lista-vehiculos.html',
  styleUrl: './a-lista-vehiculos.scss'
})
export class AListaVehiculos implements OnInit {

  vehicles$: Observable<VehicleForm[]>;

  constructor(
    private router: Router,
    private vehicleService: Vehicle
  ) {
    this.vehicles$ = this.vehicleService.vehicles$;
  }

  ngOnInit(): void {
    this.vehicleService.getVehicles();

  }

  irAgregarVehiculo() {
    this.router.navigate(['/admin/agregar-vehiculo']);
  }

  // MODAL DE CONFIRMACIÓN

  mostrarModalEliminacion = false;
  idVehiculo? = 0;

  deleteVehicle(id?: number) {
    this.mostrarModalEliminacion = true;
    this.idVehiculo = id;
  }

  confirmarEliminar() {
    if (this.idVehiculo) {
      this.vehicleService.deleteVehicle(this.idVehiculo).subscribe({
        next: () => {
          this.mostrarModalEliminacion = false;
          console.log('Vehículo eliminado con éxito.');
        },
        error: (error) => {
          console.error('Hubo un error al eliminar el vehículo:', error);
        }
      });
    } else {
      console.error('No se pudo obtener el ID del vehículo para eliminar.');
    }
  }

  cancelarEliminacion() {
    this.mostrarModalEliminacion = false;
  }


  // EDITAR EL VEHICULO

  editAVehicle(id?: number) {
    console.log('ttrtrtrtrtrt', id);
    // if (id) {
    //   console.log('aaaaaaa', id);
    //   this.router.navigate(['/admin/editar-vehiculo', id]);
    // }
  }

}
