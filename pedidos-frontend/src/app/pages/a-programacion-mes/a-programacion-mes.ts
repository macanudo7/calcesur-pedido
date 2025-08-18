import { Component } from '@angular/core';

@Component({
  selector: 'app-a-programacion-mes',
  imports: [],
  templateUrl: './a-programacion-mes.html',
  styleUrl: './a-programacion-mes.scss',
  standalone: true,
})
export class AProgramacionMes {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

}
