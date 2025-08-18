import { Component } from '@angular/core';

@Component({
  selector: 'app-a-efectividad-entrega',
  imports: [],
  templateUrl: './a-efectividad-entrega.html',
  styleUrl: './a-efectividad-entrega.scss',
  standalone: true,
})
export class AEfectividadEntrega {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

  descargarTabla() {
    console.log(':)')
  }

}
