import { Component, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderForm, OrderDate, OrderDetail, OrderDateDetail } from '../../shared/interfaces/order.interface';
import { Order } from '../../services/order';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';


@Component({
  selector: 'app-a-editar-pedidos-por-confirmar',
  imports: [CommonModule, ModalConfirmacion],
  templateUrl: './a-editar-pedidos-por-confirmar.html',
  styleUrl: './a-editar-pedidos-por-confirmar.scss',
  standalone: true,
})
export class AEditarPedidosPorConfirmar implements OnInit {

  nameOfUser: string | null = null;
  userId?: number;
  productName: string = '';
  ordersPerDay: OrderDateDetail[] = [];
  nameOfVehicle: string = '';
  nameOfClient: string = '';
  dateOfOrder: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: Order,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.nameOfUser = sessionStorage.getItem('userName');
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;

        this.orderService.getOrderDetail(this.userId).subscribe(user => {
          this.productName = user.product?.name || 'Desconocido';
          this.nameOfVehicle = user.product?.typeVehicle?.name || 'Desconocido';
          this.nameOfClient = user.user?.username || 'Desconocido';
          this.dateOfOrder = user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
            : 'Desconocido';

          this.ordersPerDay = user.orderDates || [];
          this.ordersPerDay.sort((a, b) => new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime());
          console.log('Orders per day:', this.ordersPerDay);
        });
      }
    });

  }

  confirmAllOrders() {
    if (!this.ordersPerDay.length) return;

    // Filtramos los pedidos pendientes
    const pendingOrders = this.ordersPerDay.filter(o => o.status === 'pending');

    if (!pendingOrders.length) {
      console.log('No hay pedidos pendientes para confirmar.');
      return;
    }

    // Actualizamos cada pedido localmente
    this.ordersPerDay = this.ordersPerDay.map(order => ({
      ...order,
      status: order.status === 'pending' ? 'confirmed' : order.status,
      is_delivered: order.status === 'pending' ? 'por_entregar' : order.is_delivered,
    }));

    this.cd.detectChanges();

    // Hacemos la llamada al servicio una sola vez (si tu API lo permite)
    if (this.userId) {
      this.orderService.getOrderDetail(this.userId).subscribe(order => {
        if (order.orderDates) {
          order.orderDates = order.orderDates.map(od => ({
            ...od,
            status: od.status === 'pending' ? 'confirmed' : od.status,
            is_delivered: od.status === 'pending' ? 'por_entregar' : od.is_delivered,
          }));

          // Actualizamos el estado general si todos están confirmados
          const allConfirmed = order.orderDates.every(od => od.status === 'confirmed');
          if (allConfirmed) {
            order.status = 'confirmed';
          }

          // Enviamos todo al backend
          this.orderService.changeStatus(order).subscribe(updatedOrder => {
            console.log('Todos los pedidos confirmados:', updatedOrder);
          });
        }
      });
    }
  }

  goToEditOrderForConfirm(id: number, idDate: number) {
    console.log('ID del pedido:', id);
    console.log('ID de la fecha del pedido:', idDate);
    if (id) {
      this.orderService.getOrderDetail(id).subscribe(order => {


        const oneOrderDate = order.orderDates?.find(od => od.order_date_id === idDate);

        if (oneOrderDate) {
          const updatedOrderDate: OrderDateDetail = {
            ...oneOrderDate,
            status: 'confirmed',
            is_delivered: 'por_entregar',
          };

          order.orderDates = order.orderDates?.map(od =>
            od.order_date_id === idDate ? updatedOrderDate : od
          );

          this.ordersPerDay = this.ordersPerDay.map(od =>
            od.order_date_id === idDate ? updatedOrderDate : od
          );

          const allConfirmed = order.orderDates?.every(od => od.status === 'confirmed');

          if (allConfirmed) {
            order.status = 'confirmed';
          }

          this.cd.detectChanges();

          this.orderService.changeStatus(order).subscribe(updatedOrder => {
            console.log('Orden actualizada en backend:', updatedOrder);
          });
        }


      });
    }
  }

  gotoListOrders() {
    this.router.navigate(['/admin/pedidos-por-confirmar']);
  }

}
