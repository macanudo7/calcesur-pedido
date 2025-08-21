import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../services/order';
import { OrderDetail } from '../../shared/interfaces/order.interface';
import { DatePipe, CommonModule } from '@angular/common';


@Component({
  selector: 'app-c-historial-pedidos-detalle',
  templateUrl: './c-historial-pedidos-detalle.html',
  styleUrl: './c-historial-pedidos-detalle.scss',
  standalone: true,
  imports: [CommonModule, DatePipe],
})
export class CHistorialPedidosDetalle implements OnInit {
  orderId: number = 0;
  orderDetail: OrderDetail | null = null;

  constructor(private route: ActivatedRoute, private orderService: Order) {}

  ngOnInit() {
    // Obtener el ID del pedido desde la URL
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));

    // Consultar los detalles del pedido
    this.orderService.getOrderDetail(this.orderId).subscribe({
      next: (data) => {
        this.orderDetail = data;
        console.log('Detalles del pedido:', this.orderDetail);
      },
      error: (err) => {
        console.error('Error al obtener los detalles del pedido:', err);
      },
    });
  }
}
