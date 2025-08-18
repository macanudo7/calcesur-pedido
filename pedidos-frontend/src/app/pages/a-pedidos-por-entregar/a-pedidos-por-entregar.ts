import { Component } from '@angular/core';

@Component({
  selector: 'app-a-pedidos-por-entregar',
  imports: [],
  templateUrl: './a-pedidos-por-entregar.html',
  styleUrl: './a-pedidos-por-entregar.scss',
  standalone: true,
})
export class APedidosPorEntregar {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

  descargarTabla() {
    console.log(':)')
  }

}
