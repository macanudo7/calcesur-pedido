import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product';
import { Observable } from 'rxjs';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';
import { ProductoForm } from '../../shared/interfaces/productos.interface';

@Component({
  selector: 'app-lista-productos',
  imports: [CommonModule, ModalConfirmacion],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.scss',
  standalone: true,
})
export class ListaProductos implements OnInit{

  nameOfUser: string = sessionStorage.getItem('userName') || '';

  products$: Observable<ProductoForm[]>;

  constructor(
    private router: Router,
    private productService: Product
  ) {
    this.products$ = this.productService.products$;
  }

  ngOnInit(): void {
    this.productService.getProducts();
  }

  irAgregarProducto() {
    this.router.navigate(['/admin/agregar-producto']);
  }

  // MODAL DE CONFIRMACIÓN

  mostrarModalEliminacion = false;
  idProducto? = 0;

  deleteProduct(id?: number) {
    this.mostrarModalEliminacion = true;
    this.idProducto = id;
  }

  // ELIMINAR PRODUCTO

  confirmarEliminar() {
    if (this.idProducto) {
      this.productService.deleteProduct(this.idProducto).subscribe({
        next: () => {
          this.mostrarModalEliminacion = false;
          console.log('Producto eliminado con éxito.');
        },
        error: (error) => {
          console.error('Hubo un error al eliminar el producto:', error);
        }
      });
    } else {
      console.error('No se ha seleccionado un producto para eliminar.');
    }
  }

  cancelarEliminacion() {
    this.mostrarModalEliminacion = false;
  }

  // EDITAR PRODUCTO

  editProduct(id: number) {
    if (id) {
      this.router.navigate(['/admin/editar-producto', id]);
    }
  }
}
