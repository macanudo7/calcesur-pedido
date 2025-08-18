import { Component } from '@angular/core';

@Component({
  selector: 'app-c-historial-pedidos',
  imports: [],
  templateUrl: './c-historial-pedidos.html',
  styleUrl: './c-historial-pedidos.scss'
})
export class CHistorialPedidos {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

}
