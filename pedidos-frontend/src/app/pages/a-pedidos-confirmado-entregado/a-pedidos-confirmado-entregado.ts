import { Component } from '@angular/core';

@Component({
  selector: 'app-a-pedidos-confirmado-entregado',
  imports: [],
  templateUrl: './a-pedidos-confirmado-entregado.html',
  styleUrl: './a-pedidos-confirmado-entregado.scss',
  standalone: true,
})
export class APedidosConfirmadoEntregado {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

}
