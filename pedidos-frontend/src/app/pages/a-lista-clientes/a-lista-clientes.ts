import { Component } from '@angular/core';

@Component({
  selector: 'app-a-lista-clientes',
  imports: [],
  templateUrl: './a-lista-clientes.html',
  styleUrl: './a-lista-clientes.scss',
  standalone: true,
})
export class AListaClientes {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

}
