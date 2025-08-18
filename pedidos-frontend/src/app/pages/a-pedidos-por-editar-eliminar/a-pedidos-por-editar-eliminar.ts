import { Component } from '@angular/core';

@Component({
  selector: 'app-a-pedidos-por-editar-eliminar',
  imports: [],
  templateUrl: './a-pedidos-por-editar-eliminar.html',
  styleUrl: './a-pedidos-por-editar-eliminar.scss',
  standalone: true,
})
export class APedidosPorEditarEliminar {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

  descargarTabla() {
    console.log(':)')
  }

}
