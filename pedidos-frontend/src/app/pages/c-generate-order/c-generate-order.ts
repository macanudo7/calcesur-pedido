import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product'; // Asegúrate de que la ruta sea correcta
import { Order } from '../../services/order'; // Asegúrate de que la ruta sea correcta
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ProductoForm } from '../../shared/interfaces/productos.interface'; // Asegúrate de que la ruta sea correcta
import { OrderForm, OrderDate } from '../../shared/interfaces/order.interface'; // Interfaz de pedidos


@Component({
  selector: 'app-c-generate-order',
  imports: [CommonModule,FormsModule],
  templateUrl: './c-generate-order.html',
  styleUrl: './c-generate-order.scss'
})
export class CGenerateOrder implements OnInit{

  nameOfUser: string = sessionStorage.getItem('userName') || '';
  idOfUser: number = Number(sessionStorage.getItem('userId')) || 0;
  diasDelMes: { dia: number, nombre: string, anio: number }[] = [];
  public products$: Observable<ProductoForm[]>;
  selectedProductId: number | null = null; // Producto seleccionado
  orderDates: OrderDate[] = []; // Fechas de entrega para el pedido
  titleModalExito = 'Tu solicitud ha sido registrada con éxito';
  mostrarModalExito=false; // Controla la visibilidad del modal de éxito


  constructor(
    private productService: Product, private orderService: Order, private router: Router,
    private route: ActivatedRoute, // Asegúrate de que la ruta sea correcta
  ) {
    this.products$ = this.productService.products$; // Asignar el observable de productos
  }


  ngOnInit():void {
    this.generarDiasDelMes(); 
    this.productService.getProducts(); // Obtener los productos al iniciar el componente

    
  }

  generarDiasDelMes() {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth(); // Mes actual (0-11)
    const anioActual = fechaActual.getFullYear();

    // Calcular el mes siguiente
    const mesSiguiente = (mesActual + 1) % 12; // Si es diciembre (11), vuelve a enero (0)
    const anioSiguiente = mesActual === 11 ? anioActual + 1 : anioActual; // Incrementar el año si es diciembre

    const diasEnMes = new Date(anioSiguiente, mesSiguiente + 1, 0).getDate(); // Días en el mes siguiente

    this.diasDelMes = []; // Reiniciar la lista de días
    for (let i = 1; i <= diasEnMes; i++) {
      const fecha = new Date(anioSiguiente, mesSiguiente, i);
      const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'long' });
      this.diasDelMes.push({
        dia: i,
        nombre: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
        anio: anioSiguiente, // Agregar el año
      });

       // Inicializar las fechas de entrega con valores predeterminados
       this.orderDates.push({
        delivery_date: `${anioSiguiente}-${mesSiguiente + 1}-${i < 10 ? '0' + i : i}`,
        quantity: 0,
        status: 'pending',
      });
    }
  }


  solicitarPedido() {
    if (!this.selectedProductId) {
      alert('Por favor, selecciona un producto.');
      return;
    }

    const todasEnCero = this.orderDates.every((date) => date.quantity === 0);
    if (todasEnCero) {
      alert('Por favor, llena al menos una cantidad para las fechas seleccionadas.');
      return;
    }

    const payload: OrderForm = {
      user_id: this.idOfUser, // Usar el user_id extraído del token
      product_id: this.selectedProductId,
      status: 'pending',
      orderDates: this.orderDates
        .filter((date) => date.quantity > 0) // Solo incluir fechas con cantidad > 0
        .map(({ delivery_date, quantity }) => ({
          delivery_date,
          quantity,
        })), // Excluir el campo status
    };

    this.orderService.createOrder(payload).subscribe({
      next: (response) => {
        this.mostrarModalExito = true;
        //console.log('Pedido creado con éxito:', response);
        //alert('Pedido creado con éxito.');
      },
      error: (error) => {
        console.error('Error al crear el pedido:', error);
        alert('Error al crear el pedido.');
      },
    });

    
  }

  irAListaVehiculos() {
    this.mostrarModalExito = false;
    this.router.navigate(['/cliente/historial-pedidos']);
  }
}