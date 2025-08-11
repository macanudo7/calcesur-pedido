import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-a-lista-usuarios',
  imports: [],
  templateUrl: './a-lista-usuarios.html',
  styleUrl: './a-lista-usuarios.scss',
  standalone: true,
})
export class AListaUsuarios {
  constructor(private router: Router) {}

  irAgregarUsuario() {
    this.router.navigate(['/admin/agregar-usuario']);
  }
}
