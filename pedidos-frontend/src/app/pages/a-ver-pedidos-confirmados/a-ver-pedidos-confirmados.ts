import { Component, OnInit, ChangeDetectorRef, signal, computed, NgZone } from '@angular/core';
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
  dateOfOrder: string = '';

  // Modal / form para "Atender pedido"
  mostrarAtenderModal = false;
  attendingOrderId?: number | null = null;
  attendingOrderDateId?: number | null = null;
  attendingDriverName = '';
  attendingVehiclePlate = '';
  isSavingAtender = false;
  showDriverInfoMap: Record<string, boolean> = {};


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: Order,
    private orderDateService: OrderDateService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    
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
      this.dateOfOrder = data.createdAt
            ? new Date(data.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
            : 'Desconocido';
      this.ordersPerDay = data.orderDates || [];
      this.ordersPerDay.sort((a, b) => new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime());
      console.log('Orders per day:', this.ordersPerDay);

      // sincronizar showDriverInfoMap para que las filas "atendiendo" se muestren al reload
      const newMap: Record<string, boolean> = { ...this.showDriverInfoMap };
      for (const od of this.ordersPerDay) {
        const key = String(od.order_date_id);
        // si ya estaba marcado lo conservamos, sino lo activamos si backend indica 'atendiendo'
        newMap[key] = newMap[key] ?? (od.is_delivered === 'atendiendo');
      }
      this.showDriverInfoMap = newMap;
      try { this.cd.detectChanges(); } catch (e) { /* noop */ }
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
    const targetId = Number(this.attendingOrderDateId);

    try {
      await firstValueFrom(this.orderDateService.update(targetId, payload));
      // recargar datos para reflejar cambio
      await this.reloadOrderDetail();
      // abrir inmediatamente el panel de detalles para la fecha atendida
      this.showDriverInfoMap = { ...this.showDriverInfoMap, [targetId]: true };
      try { this.cd.detectChanges(); } catch (e) { /* noop */ }
    } catch (err) {
      console.error('[confirmarAtender] error:', err);
    } finally {
      this.isSavingAtender = false;
      this.cancelarAtender();
    }
  }

  async revertirAtencion(orderDateId?: number | null) {
    if (!orderDateId) return;
    this.isSavingAtender = true;
    try {
      const payload: any = {
        is_delivered: 'por_entregar',
        driver_name: null,
        vehicle_plate: null
      };

      // Espera la respuesta del backend
      await firstValueFrom(this.orderDateService.update(orderDateId, payload));

      // Actualización optimista INMUTABLE dentro de NgZone para garantizar re-render
      this.ngZone.run(() => {
        const idx = this.ordersPerDay.findIndex(o => o.order_date_id === orderDateId);
        if (idx > -1) {
          const updated = {
            ...this.ordersPerDay[idx],
            is_delivered: 'por_entregar',
            driver_name: null,
            vehicle_plate: null
          };
          this.ordersPerDay = [
            ...this.ordersPerDay.slice(0, idx),
            updated,
            ...this.ordersPerDay.slice(idx + 1)
          ];
        }
        // Forzar detección
        this.cd.detectChanges();
      });

      // Opcional: recargar desde backend para asegurar consistencia (puedes comentar si no quieres)
      await this.reloadOrderDetail();
    } catch (err) {
      console.error('[revertirAtencion] error:', err);
    } finally {
      this.isSavingAtender = false;
    }
  }


  toggleDriverInfo(orderDateId?: number | null) {
    if (orderDateId == null) return;
    const key = String(orderDateId);
    this.showDriverInfoMap = { ...this.showDriverInfoMap, [key]: !this.showDriverInfoMap[key] };
    try { this.cd.detectChanges(); } catch (e) { /* noop */ }
  }

// trackBy para el *ngFor
trackByOrderDateId(index: number, item: OrderDateDetail) {
  return item.order_date_id ?? index;
}

}
