import { Component, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { OrderForm, OrderDate, OrderDetail, OrderDateDetail } from '../../shared/interfaces/order.interface';
import { Order } from '../../services/order';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderDateService } from '../../services/order-date';

@Component({
  selector: 'app-a-ver-pedidos-confirmados',
  imports: [CommonModule, FormsModule],
  templateUrl: './a-ver-pedidos-confirmados.html',
  styleUrl: './a-ver-pedidos-confirmados.scss',
  standalone: true,
})
export class AVerPedidosConfirmados implements OnInit {
  nameOfUser: string | null = null;
  userId?: number;
  productName: string = '';
  ordersPerDay: OrderDateDetail[] = [];
  nameOfVehicle: string = '';
  nameOfClient: string = '';

  // Modal / form para "Atender pedido"
  mostrarAtenderModal = false;
  attendingOrderId?: number | null = null;
  attendingOrderDateId?: number | null = null;
  attendingDriverName = '';
  attendingVehiclePlate = '';
  isSavingAtender = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: Order,
    private orderDateService: OrderDateService,
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
        this.reloadOrderDetail();
      }
    });
  }

  // extraer recarga para reutilizar después de cambios
  async reloadOrderDetail() {
    if (!this.userId) return;
    try {
      const data = await firstValueFrom(this.orderService.getOrderDetail(this.userId));
      this.productName = data.product?.name || 'Desconocido';
      this.nameOfVehicle = data.product?.typeVehicle?.name || 'Desconocido';
      this.nameOfClient = data.user?.username || 'Desconocido';
      this.ordersPerDay = data.orderDates || [];
      this.ordersPerDay.sort((a, b) => new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime());
      console.log('Orders per day:', this.ordersPerDay);
    } catch (err) {
      console.error('Error cargando detalle de pedido:', err);
    }
  }

  gotoListOrders() {
    this.router.navigate(['/admin/pedidos-por-entregar']);
  }

  atenderPedido(orderId?: number, orderDateId?: number) {
    // abrir modal de atención con campos vacíos
    this.openAtenderModal(orderId, orderDateId);
  }

  openAtenderModal(orderId?: number, orderDateId?: number) {
    this.attendingOrderId = orderId ?? null;
    this.attendingOrderDateId = orderDateId ?? null;
    this.attendingDriverName = '';
    this.attendingVehiclePlate = '';
    this.mostrarAtenderModal = true;
    try { this.cd.detectChanges(); } catch (e) { /* noop */ }
  }

  cancelarAtender() {
    this.mostrarAtenderModal = false;
    this.attendingOrderId = null;
    this.attendingOrderDateId = null;
    this.attendingDriverName = '';
    this.attendingVehiclePlate = '';
    try { this.cd.detectChanges(); } catch (e) { /* noop */ }
  }

  async confirmarAtender() {
    if (!this.attendingOrderDateId) return;
    this.isSavingAtender = true;
    const payload: any = {
      is_delivered: 'atendiendo',
      driver_name: this.attendingDriverName || null,
      vehicle_plate: this.attendingVehiclePlate || null
    };

    try {
      await firstValueFrom(this.orderDateService.update(this.attendingOrderDateId, payload));
      // recargar datos para reflejar cambio
      await this.reloadOrderDetail();
    } catch (err) {
      console.error('[confirmarAtender] error:', err);
    } finally {
      this.isSavingAtender = false;
      this.cancelarAtender();
    }
  }
}
