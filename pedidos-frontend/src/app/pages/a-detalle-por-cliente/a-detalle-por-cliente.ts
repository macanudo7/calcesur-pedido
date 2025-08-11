import { Component } from '@angular/core';

@Component({
  selector: 'app-a-detalle-por-cliente',
  imports: [],
  templateUrl: './a-detalle-por-cliente.html',
  styleUrl: './a-detalle-por-cliente.scss',
  standalone: true,
})
export class ADetallePorCliente {

  descargarTabla() {
    console.log(':)')
  }

}
