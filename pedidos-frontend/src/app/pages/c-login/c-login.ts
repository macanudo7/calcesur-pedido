import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-c-login',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './c-login.html',
  styleUrl: './c-login.scss'
})
export class CLogin {

  mostrarModal = false;

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

}
