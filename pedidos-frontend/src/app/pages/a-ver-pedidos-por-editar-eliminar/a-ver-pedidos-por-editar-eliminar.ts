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
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';

@Component({
  selector: 'app-a-ver-pedidos-por-editar-eliminar',
  imports: [CommonModule, DatePipe, FormsModule, RouterModule, ModalConfirmacion],
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
  // modoEdicion y confirmación de guardado eliminados: componente en solo lectura
  latestCRsByOrderDateId: Record<number, ChangeRequest | null> = {};

  // Modal confirmación
  mostrarModalConfirmacion = false;
  modalMessage = '';
  pendingCR: ChangeRequest | null = null;
  pendingAction: 'approve' | 'reject' | null = null;

  // Almacén para poder deshacer cambios: keyed by request_id
  private revertStore: Record<number, {
    odId?: number | null;
    odPrev?: { quantity?: number; status?: string; is_delivered?: any } | null;
    crPrevStatus?: string | null;
    crPrevNotes?: string | null;
  }> = {};

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

  // toggleEditar eliminado (componente ya no permite editar)
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

  // Eliminadas funciones de edición/guardado/eliminación. Componente en vista-only.
  descargarTabla(){ /* noop por ahora */ }


  confimarCambio(){
    alert('No implementado. Contacta con el administrador del sistema.');
  }

  openConfirmModal(action: 'approve' | 'reject', cr: ChangeRequest) {
    console.debug('[openConfirmModal] action:', action, 'cr:', cr);
    this.pendingCR = cr;
    this.pendingAction = action;

    // guardar snapshot previo (si no existe) para poder deshacer después
    if (cr && cr.request_id && !this.revertStore[cr.request_id]) {
      const odId = cr.order_date_id;
      const odEntry = odId
        ? Object.values(this.orderDatesMap).find((o: any) => o.order_date_id === odId)
        : undefined;
      this.revertStore[cr.request_id] = {
        odId: odId ?? null,
        odPrev: odEntry
          ? {
              quantity: odEntry.quantity,
              status: odEntry.status,
              is_delivered: odEntry.is_delivered
            }
          : null,
        crPrevStatus: cr.status ?? null,
        crPrevNotes: cr.admin_notes ?? null
      };
      console.debug('[openConfirmModal] saved revert snapshot for req:', cr.request_id, this.revertStore[cr.request_id]);
    }

    if (action === 'approve') {
      this.modalMessage = cr.request_type === 'change_quantity'
        ? '¿Confirmar cambio de cantidad?'
        : cr.request_type === 'cancel'
        ? '¿Confirmar cancelación del pedido?'
        : cr.request_type === 'create_order_date'
        ? '¿Confirmar creación de pedido?'
        : '¿Confirmar solicitud?';
    } else {
      this.modalMessage = '¿Rechazar esta solicitud?';
    }

    // Mostrar modal y forzar actualización de la vista
    this.mostrarModalConfirmacion = true;
    try { this.cd.detectChanges(); } catch (e) { /* noop */ }

    // pequeña garantía extra: asegurar que el DOM aplique estilos tras el tick
    setTimeout(() => {
      try {
        const el = document.getElementById('modalConfirmRoot');
        if (el) el.style.zIndex = '99999';
      } catch (e) { /* noop */ }
    }, 20);

    console.debug('[openConfirmModal] mostrarModalConfirmacion set to true');
  }

  async confirmarAccion() {
    if (!this.pendingCR || !this.pendingCR.request_id) {
      this.mostrarModalConfirmacion = false;
      this.pendingCR = null;
      this.pendingAction = null;
      return;
    }

    const reqId = this.pendingCR.request_id;
    const nowIso = new Date().toISOString();

    try {
      if (this.pendingAction === 'approve') {
        try {
          if (this.pendingCR.request_type === 'change_quantity') {
            const odId = this.pendingCR.order_date_id;
            const newQty = (this.pendingCR as any).change_quantity;
            if (odId && typeof newQty === 'number') {
              await firstValueFrom(this.orderDateService.update(odId, { quantity: newQty }));
            }
          } else if (this.pendingCR.request_type === 'cancel') {
            const odId = this.pendingCR.order_date_id;
            if (odId) {
              await firstValueFrom(this.orderDateService.update(odId, { quantity: 0, status: 'canceled' }));
            }
          } else if (this.pendingCR.request_type === 'create_order_date') {
            const odId = this.pendingCR.order_date_id;
            if (odId) {
              await firstValueFrom(this.orderDateService.update(odId, { status: 'confirmed' }));
            }
          }
        } catch (err) {
          console.error('[confirmarAccion] error aplicando cambio en order_date:', err);
        }

        // prefijo "Aprobado: " + texto previo
        const prevNotesApprove = (this.pendingCR.admin_notes || '').trim();
        const newNotesApprove = prevNotesApprove ? `Aprobado: ${prevNotesApprove}` : 'Aprobado';
        const payloadForCR = {
          status: 'approved',
          admin_notes: newNotesApprove,
          admin_response_at: nowIso
        };
        await firstValueFrom(this.changeRequestService.updateChangeRequest(reqId, payloadForCR));
      } else {
        const prevNotesReject = (this.pendingCR.admin_notes || '').trim();
        const newNotesReject = prevNotesReject ? `Rechazado: ${prevNotesReject}` : 'Rechazado';
        const payloadForCR = {
          status: 'rejected',
          admin_notes: newNotesReject,
          admin_response_at: nowIso
        };
        await firstValueFrom(this.changeRequestService.updateChangeRequest(reqId, payloadForCR));
      }

      // refrescar estado en UI
      await this.loadOrderDetail();
    } catch (err) {
      console.error('Error actualizando change request:', err);
    } finally {
      this.mostrarModalConfirmacion = false;
      try { this.cd.detectChanges(); } catch (e) { /* noop */ }
      this.pendingCR = null;
      this.pendingAction = null;
    }
  }

  // NUEVO: deshacer cambio revertiendo order_date y CR a valores guardados
  async deshacerCambio(requestId: number) {
    const snapshot = this.revertStore[requestId];
    if (!snapshot) {
      console.warn('[deshacerCambio] no snapshot for', requestId);
      return;
    }

    try {
      // revertir order_date si había snapshot
      if (snapshot.odId) {
        if (snapshot.odPrev) {
          await firstValueFrom(this.orderDateService.update(snapshot.odId, {
            quantity: snapshot.odPrev.quantity,
            status: snapshot.odPrev.status,
            is_delivered: snapshot.odPrev.is_delivered
          }));
        } else {
          // si no existía snapshot (por ejemplo creación), intentar eliminar el order_date
          try {
            await firstValueFrom(this.orderDateService.delete(snapshot.odId));
          } catch (e) {
            console.warn('[deshacerCambio] no se pudo eliminar order_date, ignorando:', e);
          }
        }
      }

      // revertir CR (status y notas) al estado previo
      const crPrevStatus = snapshot.crPrevStatus ?? 'pending';
      const crPrevNotes = snapshot.crPrevNotes; // puede ser string | null | undefined
      // Construir payload de forma segura para evitar error de tipos (no pasar null si la firma no lo acepta)
      const payloadForCR: any = { status: crPrevStatus };
      if (crPrevNotes !== undefined) {
        // si el backend acepta null y crPrevNotes puede ser null, lo dejamos tal cual
        payloadForCR.admin_notes = crPrevNotes;
      }
      // Si quieres limpiar admin_response_at, algunos tipos no aceptan null; usar undefined para omitirlo
      payloadForCR.admin_response_at = null; // si la firma TS lo rechaza, la variable es any y evitará el error
      await firstValueFrom(this.changeRequestService.updateChangeRequest(requestId, payloadForCR));

      // limpiar snapshot y refrescar UI
      delete this.revertStore[requestId];
      await this.loadOrderDetail();
    } catch (err) {
      console.error('[deshacerCambio] error:', err);
    }
  }
  async cancelarAccion() {
    // Cerrar modal y forzar ciclo de detección para actualizar la vista inmediatamente
    this.mostrarModalConfirmacion = false;
    this.pendingCR = null;
    this.pendingAction = null;
    try { this.cd.detectChanges(); } catch (e) { /* noop */ }
    // pequeña garantía adicional por si hay timing/animaciones
    setTimeout(() => {
      try { this.cd.detectChanges(); } catch (e) { /* noop */ }
    }, 0);
    console.log("mostrarModalConfirmacion set to false");
  }
}
