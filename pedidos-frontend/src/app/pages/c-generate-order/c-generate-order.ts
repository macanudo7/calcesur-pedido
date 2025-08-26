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
  confirmOrderVisible: boolean = false;
  vehiculoSeleccionado: string = '';
  private pendingPayload: OrderForm | null = null;
  activeMonthOffset = 0;
  selectedSpecUrl: string | null = null;


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
    this.generateMonthDays(this.activeMonthOffset);
  }

  


  solicitarPedido() {
    if (!this.selectedProductId) {
      alert('Por favor, selecciona un producto.');
      return;
    }

    // Considerar solo días habilitados
    const habilitadas = this.orderDates.filter(d => !this.isDateDisabled(d));
    if (habilitadas.length === 0) {
      alert('No hay fechas disponibles en este mes. Cambia a “Mes siguiente”.');
      return;
    }

    const todasEnCero = habilitadas.every((date) => date.quantity === 0);
    if (todasEnCero) {
      alert('Por favor, llena al menos una cantidad a partir de mañana.');
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
    this.confirmOrderVisible = true;

    
  }

  // Cancelar confirmación
  cancelConfirmOrder() {
    this.pendingPayload = null;
    this.confirmOrderVisible = false;
  }

  irAListaVehiculos() {
    this.mostrarModalExito = false;
    this.router.navigate(['/cliente/historial-pedidos']);
  }

  // Confirmar: enviar la petición y redirigir al historial
  confirmOrder() {
    if (!this.pendingPayload) return;

    this.orderService.createOrder(this.pendingPayload).subscribe({
      next: (response) => {
        this.confirmOrderVisible = false;
        this.pendingPayload = null;
        // navegar al historial de pedidos
        this.router.navigate(['/cliente/historial-pedidos']);
      },
      error: (error) => {
        console.error('Error al crear el pedido:', error);
        alert('Error al crear el pedido.');
        this.confirmOrderVisible = false;
        this.pendingPayload = null;
      },
    });
  }


  onProductChange(productId: number | null, products: ProductoForm[]) {
    if (productId == null) {
      this.vehiculoSeleccionado = '';
      this.selectedSpecUrl = null;
      return;
    }
  
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