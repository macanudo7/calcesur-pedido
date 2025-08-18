import { Component } from '@angular/core';

@Component({
  selector: 'app-a-programacion-semanal',
  imports: [],
  templateUrl: './a-programacion-semanal.html',
  styleUrl: './a-programacion-semanal.scss',
  standalone: true,
})
export class AProgramacionSemanal {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

  descargarTabla() {
    console.log(':)')
  }

}
