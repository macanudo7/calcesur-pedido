import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Order } from '../../services/order';
import { OrderDetail, OrderForm } from '../../shared/interfaces/order.interface';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ChangeRequestService } from '../../services/change-request';
import { CreateChangeRequestPayload, ChangeRequest } from '../../shared/interfaces/change-request.interface';
import { firstValueFrom } from 'rxjs';
import { OrderDateService } from '../../services/order-date'; // <-- añadida

@Component({
  selector: 'app-c-historial-pedidos-detalle',
  templateUrl: './c-historial-pedidos-detalle.html',
  styleUrl: './c-historial-pedidos-detalle.scss',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, RouterModule],
  providers: [DatePipe],
})
export class CHistorialPedidosDetalle implements OnInit {
  private router = inject(Router);
  orderId: number = 0;
  orderDetail: OrderDetail | null = null;
  fechasDelMes: Date[] = []; // Todas las fechas del mes
  orderDatesMap: { [key: string]: any } = {}; // Mapa de fechas a orderDates
  mesYAnio: string | null = null; // Variable auxiliar para el mes y año
  modoEdicion: boolean = false; // Variable para controlar el modo de edición
  estadoInicial: OrderDetail | null = null; // Copia del estado inicial
  confirmSaveVisible: boolean = false; // <-- nueva prop
  isSaving: boolean = false; // <-- nueva prop
  errorMessage: string | null = null; // <-- nueva prop
  latestCRsByOrderDateId: Record<number, ChangeRequest | null> = {};

  constructor(
    private route: ActivatedRoute,
    private orderService: Order,
    private changeRequestService: ChangeRequestService,
    private orderDateService: OrderDateService,
    private cd: ChangeDetectorRef, // <-- añadir
  ) {}

  ngOnInit() {
    // Suscribirse a cambios en los params para manejar navegaciones internas sin recargar el componente
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id || id === this.orderId) {
        // si es el mismo id y ya cargado, forzar recarga de CRs por si acaso
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
        this.estadoInicial = JSON.parse(JSON.stringify(data));
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
        // asegurar que se carguen las últimas CRs tras mapear las fechas
        this.loadLatestCRs();
      },
      error: (err) => {
        console.error('Error al obtener los detalles del pedido:', err);
      }
    });
  }

  toggleEditar() {
    if (this.modoEdicion) {
      // Recargar la página al cancelar
      window.location.reload();
    } else {
      // Activar el modo edición
      this.modoEdicion = true;
    }
  }
  esFechaEditable(fecha: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ignorar la hora
    return fecha > hoy; // Solo habilitar fechas posteriores a hoy
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

  async guardarCambios() {
    if (!this.orderDetail || !this.estadoInicial) return;
    this.isSaving = true;
    this.errorMessage = null;

    const changeRequestsToCreate: CreateChangeRequestPayload[] = [];
    const newOrderDatesForBackend: { delivery_date: string; quantity: number; fechaObj: Date }[] = [];
    const newOrderDatesCR: { delivery_date: string; quantity: number }[] = [];

    // detectar cambios y nuevas fechas
    for (const fecha of this.fechasDelMes) {
      const key = fecha.toDateString();
      const current = this.orderDatesMap[key] || { quantity: 0 };
      const currentQty = Number(current.quantity || 0);

      const originalOrderDate = this.estadoInicial.orderDates?.find(od =>
        // estadoInicial.delivery_date es DATEONLY "YYYY-MM-DD", comparar por día local
        this.parseDateOnlyToLocal(od.delivery_date).toDateString() === key
      );
      const originalQty = originalOrderDate ? Number(originalOrderDate.quantity || 0) : 0;

      // modificación en orderDate existente -> crear CR
      if (originalOrderDate && originalQty !== currentQty) {
        changeRequestsToCreate.push({
          order_date_id: originalOrderDate.order_date_id!,
          request_type: 'change_quantity',
          change_quantity: currentQty,
          admin_notes: `Solicitud de cambio desde cliente: ${originalQty} → ${currentQty}`
        });
      }

      // nueva orderDate (antes no existía o era 0) -> crear orderDate individual luego CR
      if ((!originalOrderDate || originalQty === 0) && currentQty > 0) {
        // guardamos también la fecha (obj Date) para formatear DATEONLY local y evitar shifts
        newOrderDatesForBackend.push({
          delivery_date: this.formatDateToDateOnly(fecha),
          fechaObj: fecha,
          quantity: currentQty
        } as any);
        newOrderDatesCR.push({ delivery_date: this.formatDateToDateOnly(fecha), quantity: currentQty });
      }

      // eliminación solicitada -> crear CR con change_quantity = 0
      if (originalOrderDate && originalQty > 0 && currentQty === 0) {
        // usar request_type 'cancel' para eliminaciones (backend puede decidir cómo tratarlo)
        changeRequestsToCreate.push({
          order_date_id: originalOrderDate.order_date_id!,
          request_type: 'cancel',
          change_quantity: 0,
          admin_notes: 'Solicitud de eliminación desde cliente'
        });
      }
    }

    // No crear CRs aquí. Solo preparar lista y deduplicar para crear después (una vez).
    // Si hay nuevas orderDates -> crearlas una por una con OrderDateService (devuelve order_date_id)
    // deduplicar CRs por order_date_id (si aplica)
    const crByOrderDate = new Map<number, CreateChangeRequestPayload>();
    for (const cr of changeRequestsToCreate) {
      if (cr.order_date_id) crByOrderDate.set(cr.order_date_id, cr);
    }
    const dedupedCRs = Array.from(crByOrderDate.values());

    const crErrors: any[] = [];

    try {
      // 1) Crear nuevos orderDates secuencialmente y para cada uno crear su CR
      for (const nd of newOrderDatesForBackend) {
        try {
          const created = await firstValueFrom(this.orderDateService.create({
            order_id: this.orderDetail.order_id,
            delivery_date: nd.delivery_date,
            quantity: nd.quantity,
            status: 'pending'
          }));
          // para orderDates nuevos usar un request_type específico (ej. 'create_order_date')
          // si tu backend prefiere otro valor (p.e. 'change_quantity'), cámbialo aquí
          await firstValueFrom(this.changeRequestService.createChangeRequest({
            order_date_id: created.order_date_id,
            request_type: 'create_order_date',
            change_quantity: created.quantity,
            admin_notes: 'Pedido nuevo desde cliente'
          }));
        } catch (err: any) {
          crErrors.push({ type: 'new', wanted: nd, err });
        }
      }

      // 2) Crear CRs para modificaciones/eliminaciones existentes (deduped)
      for (const cr of dedupedCRs) {
        try {
          // Antes de crear el CR, actualizar el estado del order_date según el tipo de solicitud
          // change_quantity -> status 'pending'
          // cancel -> status 'confirmed-elimination'
          if (cr.order_date_id) {
            const statusToSet =
              cr.request_type === 'change_quantity'
                ? 'pending'
                : cr.request_type === 'cancel'
                ? 'confirmed-elimination'
                : undefined;

            if (statusToSet) {
              try {
                // actualizar en backend
                await firstValueFrom(this.orderDateService.update(cr.order_date_id, { status: statusToSet }));
              } catch (errUpdate) {
                console.warn('[guardarCambios] no se pudo actualizar estado de order_date antes de crear CR:', errUpdate);
              }

              // actualizar copia local para reflejar el cambio inmediatamente en la UI
              for (const k of Object.keys(this.orderDatesMap)) {
                const od = this.orderDatesMap[k];
                if (od?.order_date_id === cr.order_date_id) {
                  od.status = statusToSet;
                  this.orderDatesMap[k] = od;
                }
              }
              // forzar cambio de referencia para Angular
              this.orderDatesMap = { ...this.orderDatesMap };
              try { this.cd.detectChanges(); } catch (e) { /* noop */ }
            }
          }

          // finalmente crear el change request
          await firstValueFrom(this.changeRequestService.createChangeRequest(cr));
        } catch (err: any) {
          crErrors.push({ type: 'existing', cr, err });
        }
      }
    } finally {
      this.isSaving = false;
    }

    if (crErrors.length) {
      // mostrar/registrar errores y permitir reintento por fila
      console.warn('Errores al crear CRs:', crErrors);
      this.errorMessage = 'Algunos cambios no pudieron enviarse. Reintenta.';
      return;
    }

    // todo ok
    this.modoEdicion = false;
    this.router.navigate(['/cliente/historial-pedidos']);
  }

  // helper: formatea Date (obj) a "YYYY-MM-DD" en hora local (DATEONLY)
  private formatDateToDateOnly(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Helper: parsear "YYYY-MM-DD" a Date en hora local (evita shift por zona)
  private parseDateOnlyToLocal(dateOnly: string): Date {
    if (!dateOnly) return new Date(NaN);
    const parts = String(dateOnly).split('-').map(p => Number(p));
    if (parts.length < 3) return new Date(dateOnly);
    const [y, m, d] = parts;
    return new Date(y, m - 1, d); // local midnight
  }

  // Reemplaza la implementación original por esta
  generarFechasDelMes() {
    if (!this.orderDetail || !this.orderDetail.orderDates.length) return;

    // parsear correctamente la primera delivery_date como fecha local
    const primerOrderDate = this.parseDateOnlyToLocal(this.orderDetail.orderDates[0].delivery_date);
    const anio = primerOrderDate.getFullYear();
    const mes = primerOrderDate.getMonth();

    const diasEnElMes = new Date(anio, mes + 1, 0).getDate(); // Último día del mes
    this.fechasDelMes = Array.from({ length: diasEnElMes }, (_, i) => new Date(anio, mes, i + 1));
  }

  // mapearOrderDates: usar parseDateOnlyToLocal en vez de new Date(string)
  mapearOrderDates() {
    if (!this.orderDetail) return;

    this.fechasDelMes.forEach((fecha) => {
      const fechaKey = fecha.toDateString();
      if (!this.orderDatesMap[fechaKey]) {
        this.orderDatesMap[fechaKey] = { quantity: 0, status: '', latestCR: null };
      }
    });

    this.orderDetail.orderDates.forEach((orderDate) => {
      // parsear delivery_date como local para obtener la misma fecha que en fechasDelMes
      const d = this.parseDateOnlyToLocal(orderDate.delivery_date);
      const fecha = d.toDateString();
      this.orderDatesMap[fecha] = {
        order_date_id: orderDate.order_date_id,
        order_id: orderDate.order_id,
        delivery_date: orderDate.delivery_date,
        quantity: Number(orderDate.quantity) || 0,
        status: orderDate.status,
        is_delivered: orderDate.is_delivered
        , latestCR: null
      };
    });

    // cargar últimas CRs asociadas a los order_date existentes
    this.loadLatestCRs();
  }

  private async loadLatestCRs(): Promise<void> {
    const ids = Object.values(this.orderDatesMap)
      .map((od: any) => od?.order_date_id)
      .filter((id: any) => id != null) as number[];
    if (!ids.length) return;

    console.debug('[loadLatestCRs] asking for ids:', ids);

    try {
      // Intentar usar el endpoint batch primero
      const map = await firstValueFrom(this.changeRequestService.getLatestByOrderDates(ids)).catch((e) => {
        console.warn('[loadLatestCRs] batch endpoint failed:', e);
        return {} as Record<number, ChangeRequest | null>;
      });

      console.debug('[loadLatestCRs] batch response:', map);

      // Si la respuesta batch viene vacía o sin CRs, fallback a consultar por cada order_date
      const hasAny = Object.keys(map || {}).some(k => !!(map as any)[k]);
      if (!hasAny) {
        console.debug('[loadLatestCRs] batch empty, falling back to per-order-date requests');
        const results = await Promise.all(ids.map(async (id) => {
          try {
            const arr = await firstValueFrom(this.changeRequestService.getByOrderDate(id));
            if (!arr || !arr.length) return { id, cr: null as ChangeRequest | null };
            // ordenar descendente por requested_at/createdAt
            arr.sort((a: any, b: any) => (b.requested_at || b.createdAt || '').localeCompare(a.requested_at || a.createdAt || ''));
            return { id, cr: arr[0] as ChangeRequest };
          } catch (err) {
            console.warn(`[loadLatestCRs] error getting CRs for order_date ${id}:`, err);
            return { id, cr: null as ChangeRequest | null };
          }
        }));
        // poblar el map con resultados del fallback
        for (const r of results) {
          (map as any)[r.id] = r.cr;
        }
      }

      // asignar al state y actualizar orderDatesMap.latestCR
      this.latestCRsByOrderDateId = map as Record<number, ChangeRequest | null>;
      for (const key of Object.keys(this.orderDatesMap)) {
        const od = this.orderDatesMap[key];
        if (od?.order_date_id) {
          od.latestCR = this.latestCRsByOrderDateId[od.order_date_id] || null;
          this.orderDatesMap[key] = od;
        }
      }

      // 1) Reasignar la referencia del objeto para que Angular detecte el cambio
      this.orderDatesMap = { ...this.orderDatesMap };

      // 2) Forzar una comprobación de cambios inmediatamente
      try { this.cd.detectChanges(); } catch (e) { /* noop si no funciona */ }

      console.debug('[loadLatestCRs] assigned latestCRsByOrderDateId:', this.latestCRsByOrderDateId);
    } catch (err) {
      console.error('[loadLatestCRs] unexpected error:', err);
    }
  }

  /**
   * Marca la cantidad del orderDate correspondiente a `fecha` como 0.
   * La intención es que al guardar (guardarCambios) se envíe el payload
   * con esa cantidad 0 y el backend realice la modificación correspondiente.
   */
  eliminarOrderDate(fecha: Date) {
    const key = fecha.toDateString();
    const od = this.orderDatesMap[key] || {};

    // Si no existe la entrada la inicializamos para que el binding funcione
    if (!od) {
      this.orderDatesMap[key] = { quantity: 0, status: 'confirmed-elimination' };
      return;
    }

    // Poner cantidad a 0
    od.quantity = 0;

    // Opcional: marcar estado localmente para que la UI muestre "Por confirmar su eliminación"
    // usa 'confirmed-elimination' que ya está mapeado en la plantilla
    od.status = 'confirmed-elimination';

    // Guardar cambios en el mapa (necesario si la referencia cambió)
    this.orderDatesMap[key] = od;

    // Si quieres dar feedback inmediato al usuario podrías console.log o mostrar un toast
    console.log(`OrderDate en ${key} marcado con quantity=0`);
  }



  descargarTabla(){

  }
  
  openConfirmSave() {
    this.confirmSaveVisible = true;
  }

  cancelConfirmSave() {
    this.confirmSaveVisible = false;
  }

  confirmSave() {
    this.confirmSaveVisible = false;
    // llama al método que realiza el guardado (y la navegación)
    this.guardarCambios();
  }
}