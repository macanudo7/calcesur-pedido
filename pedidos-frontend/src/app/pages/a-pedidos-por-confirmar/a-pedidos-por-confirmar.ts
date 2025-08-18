import { Component } from '@angular/core';

@Component({
  selector: 'app-a-pedidos-por-confirmar',
  imports: [],
  templateUrl: './a-pedidos-por-confirmar.html',
  styleUrl: './a-pedidos-por-confirmar.scss',
  standalone: true,
})
export class APedidosPorConfirmar {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

  descargarTabla() {
    console.log(':)')
  }

}
