import { Component } from '@angular/core';

@Component({
  selector: 'app-a-otif-por-dia',
  imports: [],
  templateUrl: './a-otif-por-dia.html',
  styleUrl: './a-otif-por-dia.scss',
  standalone: true,
})
export class AOtifPorDia {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

  descargarTabla() {
    console.log(':)')
  }

}
