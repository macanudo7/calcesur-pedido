import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product'; // Asegúrate de que la ruta sea correcta
import { Order } from '../../services/order'; // Asegúrate de que la ruta sea correcta
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ProductoForm } from '../../shared/interfaces/productos.interface'; // Asegúrate de que la ruta sea correcta
import { OrderForm, OrderDate } from '../../shared/interfaces/order.interface'; // Interfaz de pedidos
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';



@Component({
  selector: 'app-c-generate-order',
  imports: [CommonModule,FormsModule,ModalConfirmacion],
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
  titleModalExito = 'Tu pedido ha sido registrado con éxito';
  mostrarModalExito=false; // Controla la visibilidad del modal de éxito
  confirmOrderVisible: boolean = true;
  vehiculoSeleccionado: string = '';
  private pendingPayload: OrderForm | null = null;
  activeMonthOffset = 0;
  selectedSpecUrl: string | null = null;
  productValidationError: boolean = false;
  datesValidationError: boolean = false;
  quantitiesValidationError: boolean = false;
  mostrarModalConfirmacion = false;
  errorMessage: string | null = null;



  constructor(
    private productService: Product, private orderService: Order, private router: Router,
    private route: ActivatedRoute, // Asegúrate de que la ruta sea correcta
  ) {
    this.products$ = this.productService.products$; // Asignar el observable de productos
  }


  ngOnInit():void {
    this.selectedProductId = null;
    this.generateMonthDays(0); // mes actual por defecto
    this.productService.getProducts(); // Obtener los productos al iniciar el componente
    console.log(this.products$);
    
  }

  private generateMonthDays(offset: number) {
    const base = new Date();
    const target = new Date(base.getFullYear(), base.getMonth() + offset, 1);
    const year = target.getFullYear();
    const month = target.getMonth(); // 0-11
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    this.diasDelMes = [];
    this.orderDates = [];
  
    const pad = (n: number) => n.toString().padStart(2, '0');
  
    for (let day = 1; day <= daysInMonth; day++) {
      const fecha = new Date(year, month, day);
      const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'long' });
      this.diasDelMes.push({
        dia: day,
        nombre: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
        anio: year,
      });
  
      this.orderDates.push({
        delivery_date: `${year}-${pad(month + 1)}-${pad(day)}`,
        quantity: 0,
      } as OrderDate);
    }
  }
  
  // Toggle entre mes actual y siguiente
  toggleMonth(event?: Event) {
    event?.preventDefault();
    this.activeMonthOffset = this.activeMonthOffset === 0 ? 1 : 0;
    // limpiar errores al cambiar mes
    this.datesValidationError = false;
    this.quantitiesValidationError = false;
    this.generateMonthDays(this.activeMonthOffset);
  }

  


  solicitarPedido() {
    this.productValidationError = false;
    this.datesValidationError = false;
    this.quantitiesValidationError = false;

    if (!this.selectedProductId) {
      // reemplaza el alert por mostrar el texto rojo en la UI      
      this.productValidationError = true;
      return;
    }

    
    

    // Considerar solo días habilitados
    const habilitadas = this.orderDates.filter(d => !this.isDateDisabled(d));
    if (habilitadas.length === 0) {
      // mostrar mensaje en UI en lugar de alert
      this.datesValidationError = true;
      return;
    }

    const todasEnCero = habilitadas.every((date) => date.quantity === 0);
    if (todasEnCero) {
      // mostrar mensaje en UI en lugar de alert
      this.quantitiesValidationError = true;
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

    this.pendingPayload = payload;
    this.mostrarModalConfirmacion = true;


    
  }

  // Cancelar confirmación
  cancelConfirmOrder() {
    this.pendingPayload = null;
    this.mostrarModalConfirmacion = false;
  }

  irAListaVehiculos() {
    this.mostrarModalExito = false;
    this.router.navigate(['/cliente/historial-pedidos']);
  }

  // Confirmar: enviar la petición y redirigir al historial
  confirmOrder() {
    if (!this.pendingPayload) return;
    console.log(this.pendingPayload);

    this.orderService.createOrder(this.pendingPayload).subscribe({
      next: (response) => {
        this.mostrarModalConfirmacion = false;
        this.pendingPayload = null;
        console.log( 'aaa', response );
        // navegar al historial de pedidos
        this.mostrarModalExito = true;
        this.errorMessage = null; // Limpia el mensaje de error

      },
      error: (error) => {

        this.mostrarModalConfirmacion = false;
        this.pendingPayload = null;

        // Manejo genérico: extraer texto de distintos formatos que pueda enviar el backend
        let msg = 'Error al crear el pedido.';
        try {
          if (!error) {
            msg = 'Error desconocido.';
          } else if (typeof error === 'string') {
            msg = error;
          } else if (error.error) {
            // error.error puede ser string o objeto { error: "...", message: "..." }
            if (typeof error.error === 'string' && error.error.trim()) {
              msg = error.error;
            } else if (typeof error.error === 'object') {
              msg = error.error.message || error.error.error || JSON.stringify(error.error);
            }
          } else if (error.message) {
            msg = error.message;
          }
        } catch (e) {
          console.error('Error al parsear el error del backend', e);
        }

        // asignar para mostrar en la UI (usa tu binding existente)
        this.errorMessage = msg;
        console.error('Error al crear el pedido:', error);
        // no usar alert para mostrar error; la UI leerá errorMessage
        
      },
    });
  }


  onProductChange(productId: number | null, products: ProductoForm[]) {
    if (productId == null) {
      this.vehiculoSeleccionado = '';
      this.selectedSpecUrl = null;
      this.productValidationError = true;
      return;
    }

    this.productValidationError = false;

    const prod = products.find(p => Number(p.id!) === Number(productId));  
    this.vehiculoSeleccionado = prod
      ? ((prod as any).type_vehicle?.name ?? (prod as any).type_vehicle ?? '')
      : '';
      this.selectedSpecUrl = prod?.spec_sheet_url != null ? String(prod.spec_sheet_url) : null;
  }

  openSpecSheet() {
    if (this.selectedSpecUrl) window.open(this.selectedSpecUrl, '_blank', 'noopener,noreferrer');
  }

  // Calcula mañana (local)
  private getTomorrow(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  }

  // Deshabilita días pasados y el día de hoy solo en mes actual
  isDateDisabled(item: OrderDate): boolean {
    if (this.activeMonthOffset !== 0) return false; // mes siguiente: nada deshabilitado
    const [y, m, d] = item.delivery_date.split('-').map(Number);
    const itemDate = new Date(y, m - 1, d);
    return itemDate < this.getTomorrow(); // solo desde mañana se permite
  }

  




}