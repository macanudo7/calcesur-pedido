import { Component, OnInit } from '@angular/core';
import { Order } from '../../services/order';
import { OrderHistory } from '../../shared/interfaces/order.interface';
import { CommonModule,DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-c-historial-pedidos',
  templateUrl: './c-historial-pedidos.html',
  styleUrl: './c-historial-pedidos.scss',
  standalone: true,
  imports: [CommonModule,RouterModule,DatePipe], // Agrega CommonModule aquí
})
export class CHistorialPedidos implements OnInit {
  nameOfUser: string = sessionStorage.getItem('userName') || '';
  userId: number = Number(sessionStorage.getItem('userId')) || 0;
  orders: OrderHistory[] = [];
  mesConsultado: string = '';
  anioConsultado: number = 0;
  esMesAnterior: boolean = false; // Controla si estás viendo el mes anterior

  constructor(private orderService: Order, private router: Router) {}

  ngOnInit() {
    const fechaActual = new Date();
    this.anioConsultado = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; // Mes actual (1-indexado)
    const dia = fechaActual.getDate(); // Día actual

    this.consultarPedidos(this.anioConsultado, mes, dia);
  }

  consultarPedidos(anio: number, mes: number, dia: number) {
    // Calcular el nombre del mes consultado
    const fecha = new Date(anio, mes - 1); // Restamos 1 porque Date usa 0-indexado
    this.mesConsultado = fecha.toLocaleDateString('es-ES', { month: 'long' });

    // Llamar a la API con el último día del mes
    this.orderService.getOrdersByUserAndMonth(this.userId, anio, mes, dia).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Error al obtener pedidos:', err);
      },
    });
  }

  verMesAnterior(event: Event) {
    event.preventDefault(); // Previene la navegación predeterminada del enlace

    let mes = new Date().getMonth() + 1; // Mes actual (1-indexado)
    let anio = this.anioConsultado;

    if (mes === 1) {
      // Si es enero, retrocede a diciembre del año anterior
      mes = 12;
      anio -= 1;
    } else {
      mes -= 1;
    }

    this.anioConsultado = anio;
    const ultimoDia = new Date(anio, mes, 0).getDate();

    this.consultarPedidos(anio, mes, ultimoDia); // Pasa `mes` directamente
    this.esMesAnterior = true; // Cambia el estado a "mes anterior"
  }

  verMesActual(event: Event) {
    event.preventDefault();

    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; // Mes actual (1-indexado)
    const dia = fechaActual.getDate(); // Día actual

    this.consultarPedidos(anio, mes, dia);
    this.esMesAnterior = false; // Cambia el estado a "mes actual"
  }

  verDetalle(orderId: number) {
    console.log(`Ver detalle del pedido ${orderId}`);
    // Aquí puedes redirigir a la página de detalles del pedido
    this.router.navigate([`/detalle-pedido/${orderId}`]); // Redirigir usando Router
  }

  editarSolicitud(orderId: number) {
    console.log(`Editar solicitud del pedido ${orderId}`);
    // Aquí puedes redirigir a la página de edición del pedido
    
  }
  descargarTabla(){
    console.log('Descargar tabla');
  }
}
