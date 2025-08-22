import { Component, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderForm } from '../../shared/interfaces/order.interface';
import { Order } from '../../services/order';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../services/user';
import { UserForm } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-a-lista-clientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './a-lista-clientes.html',
  styleUrl: './a-lista-clientes.scss',
  standalone: true,
})
export class AListaClientes implements OnInit {

  nameOfUser: string | null = null;

  orders$: Observable<OrderForm[]>;
  users$: Observable<UserForm[]>;

  searchTerm = signal('');
  selectedUserType = signal('');
  allOrders = signal<OrderForm[]>([]);
  allUsers = signal<UserForm[]>([]);

  userTypes: string[] = [];


  pendingOrders = computed(() =>
    this.allOrders().filter(order => order.status === 'pending')
  );

  constructor(
    private router: Router,
    private orderService: Order,
    private cd: ChangeDetectorRef,
    private userService: User,
  ) {
    this.orders$ = this.orderService.orders$;
    this.users$ = this.userService.users$;
  }



  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.nameOfUser = sessionStorage.getItem('userName');
    }

    this.orderService.getOrders();

    this.orders$.subscribe(orders => {
      this.allOrders.set(orders);
      console.log('Orders loaded:', orders);
      this.userTypes = Array.from(
        new Set(
          orders
            .map(o => o.product?.name)
            .filter((name): name is string => !!name)
        )
      );
    });

    this.userService.getUsers();

    this.users$.subscribe(users => {
      this.allUsers.set(users);
    });
  }

  usersWithOrders = computed(() => {
    const users = this.allUsers();
    const orders = this.allOrders();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return users.map(user => {
      const tieneOrden = orders.some(order => {
        if (order.user?.user_id !== user.user_id) return false;
        const fecha = new Date(order.createdAt!);
        return (
          fecha.getMonth() === currentMonth &&
          fecha.getFullYear() === currentYear
        );
      });

      return { ...user, existOrder: tieneOrden };
    });
  });


  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();

    return this.usersWithOrders().filter(user =>
      term ? user.name.toLowerCase().includes(term) : true
    );
  });

}
