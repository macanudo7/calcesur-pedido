import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-productos',
  imports: [],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.scss',
  standalone: true,
})
export class ListaProductos {
  constructor(private router: Router) {}

  irAgregarProducto() {
    this.router.navigate(['/admin/agregar-producto']);
  }
}
