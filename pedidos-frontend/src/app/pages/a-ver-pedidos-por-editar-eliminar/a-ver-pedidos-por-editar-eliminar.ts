import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Order } from '../../services/order';
import { OrderDetail } from '../../shared/interfaces/order.interface';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ChangeRequestService } from '../../services/change-request';
import { CreateChangeRequestPayload, ChangeRequest } from '../../shared/interfaces/change-request.interface';
import { firstValueFrom } from 'rxjs';
import { OrderDateService } from '../../services/order-date';

@Component({
  selector: 'app-a-ver-pedidos-por-editar-eliminar',
  imports: [CommonModule, DatePipe, FormsModule, RouterModule],
  templateUrl: './a-ver-pedidos-por-editar-eliminar.html',
  styleUrl: './a-ver-pedidos-por-editar-eliminar.scss',
  standalone: true,
  providers: [DatePipe],
})
export class AVerPedidosPorEditarEliminar implements OnInit {
  private router = inject(Router);
  orderId: number = 0;
  orderDetail: OrderDetail | null = null;
  fechasDelMes: Date[] = [];
  orderDatesMap: { [key: string]: any } = {};
  mesYAnio: string | null = null;
  modoEdicion: boolean = false;
  confirmSaveVisible: boolean = false;
  isSaving: boolean = false;
  errorMessage: string | null = null;
  latestCRsByOrderDateId: Record<number, ChangeRequest | null> = {};

  constructor(
    private route: ActivatedRoute,
    private orderService: Order,
    private changeRequestService: ChangeRequestService,
    private orderDateService: OrderDateService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id || id === this.orderId) {
        if (id === this.orderId) this.loadLatestCRs();
        return;
      }
      this.orderId = id;
      this.loadOrderDetail();
    });
  }

  private loadOrderDetail(): void {
    this.orderService.getOrderDetail(this.orderId).subscribe({
      next: (data) => {
        this.orderDetail = data;
        if (this.orderDetail?.orderDates?.length) {
          const deliveryDate = this.parseDateOnlyToLocal(this.orderDetail.orderDates[0].delivery_date);
          const mes = deliveryDate.toLocaleDateString('es-ES', { month: 'long' });
          const anio = deliveryDate.getFullYear();
          this.mesYAnio = `${mes} ${anio}`;
        } else {
          this.mesYAnio = null;
        }
        this.generarFechasDelMes();
        this.mapearOrderDates();
        this.loadLatestCRs();
      },
      error: (err) => {
        console.error('Error al obtener los detalles del pedido:', err);
      }
    });
  }

  toggleEditar() {
    if (this.modoEdicion) {
      window.location.reload();
    } else {
      this.modoEdicion = true;
    }
  }

  esFechaEditable(fecha: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha > hoy;
  }

  private dateDayLocal(isoLike: string): string {
    if (!isoLike) return '';
    const d = new Date(isoLike);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  private dateOnly(isoLike: string): string {
    if (!isoLike) return '';
    const d = new Date(isoLike);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private formatDateToDateOnly(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private parseDateOnlyToLocal(dateOnly: string): Date {
    if (!dateOnly) return new Date(NaN);
    const parts = String(dateOnly).split('-').map(p => Number(p));
    if (parts.length < 3) return new Date(dateOnly);
    const [y, m, d] = parts;
    return new Date(y, m - 1, d);
  }

  generarFechasDelMes() {
    if (!this.orderDetail || !this.orderDetail.orderDates.length) return;
    const primerOrderDate = this.parseDateOnlyToLocal(this.orderDetail.orderDates[0].delivery_date);
    const anio = primerOrderDate.getFullYear();
    const mes = primerOrderDate.getMonth();
    const diasEnElMes = new Date(anio, mes + 1, 0).getDate();
    this.fechasDelMes = Array.from({ length: diasEnElMes }, (_, i) => new Date(anio, mes, i + 1));
  }

  mapearOrderDates() {
    if (!this.orderDetail) return;
    this.fechasDelMes.forEach((fecha) => {
      const fechaKey = fecha.toDateString();
      if (!this.orderDatesMap[fechaKey]) {
        this.orderDatesMap[fechaKey] = { quantity: 0, status: '', latestCR: null };
      }
    });

    this.orderDetail.orderDates.forEach((orderDate) => {
      const d = this.parseDateOnlyToLocal(orderDate.delivery_date);
      const fecha = d.toDateString();
      this.orderDatesMap[fecha] = {
        order_date_id: orderDate.order_date_id,
        order_id: orderDate.order_id,
        delivery_date: orderDate.delivery_date,
        quantity: Number(orderDate.quantity) || 0,
        status: orderDate.status,
        is_delivered: orderDate.is_delivered,
        latestCR: null
      };
    });

    this.loadLatestCRs();
  }

  private async loadLatestCRs(): Promise<void> {
    const ids = Object.values(this.orderDatesMap)
      .map((od: any) => od?.order_date_id)
      .filter((id: any) => id != null) as number[];
    if (!ids.length) return;

    try {
      const map = await firstValueFrom(this.changeRequestService.getLatestByOrderDates(ids)).catch(() => ({} as Record<number, ChangeRequest | null>));
      const hasAny = Object.keys(map || {}).some(k => !!(map as any)[k]);
      if (!hasAny) {
        const results = await Promise.all(ids.map(async (id) => {
          try {
            const arr = await firstValueFrom(this.changeRequestService.getByOrderDate(id));
            if (!arr || !arr.length) return { id, cr: null as ChangeRequest | null };
            arr.sort((a: any, b: any) => (b.requested_at || b.createdAt || '').localeCompare(a.requested_at || a.createdAt || ''));
            return { id, cr: arr[0] as ChangeRequest };
          } catch {
            return { id, cr: null as ChangeRequest | null };
          }
        }));
        for (const r of results) { (map as any)[r.id] = r.cr; }
      }

      this.latestCRsByOrderDateId = map as Record<number, ChangeRequest | null>;
      for (const key of Object.keys(this.orderDatesMap)) {
        const od = this.orderDatesMap[key];
        if (od?.order_date_id) {
          od.latestCR = this.latestCRsByOrderDateId[od.order_date_id] || null;
          this.orderDatesMap[key] = od;
        }
      }

      this.orderDatesMap = { ...this.orderDatesMap };
      try { this.cd.detectChanges(); } catch (e) { /* noop */ }
    } catch (err) {
      console.error('[loadLatestCRs] unexpected error:', err);
    }
  }

  eliminarOrderDate(fecha: Date) {
    const key = fecha.toDateString();
    const od = this.orderDatesMap[key] || {};
    if (!od) {
      this.orderDatesMap[key] = { quantity: 0, status: 'confirmed-elimination' };
      return;
    }
    od.quantity = 0;
    od.status = 'confirmed-elimination';
    this.orderDatesMap[key] = od;
    console.log(`OrderDate en ${key} marcado con quantity=0`);
  }

  descargarTabla(){ /* noop por ahora */ }

  openConfirmSave() { this.confirmSaveVisible = true; }
  cancelConfirmSave() { this.confirmSaveVisible = false; }
  confirmSave() { this.confirmSaveVisible = false; /* si quieres llamar guardarCambios, añade aquí */ }
}
