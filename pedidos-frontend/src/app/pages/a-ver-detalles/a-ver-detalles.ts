import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../services/user';

@Component({
  selector: 'app-a-ver-detalles',
  imports: [CommonModule],
  templateUrl: './a-ver-detalles.html',
  styleUrl: './a-ver-detalles.scss',
  standalone: true,
})
export class AVerDetalles implements OnInit {

  nameOfUser: string = sessionStorage.getItem('userName') || '';
  id!: number;
  nameOfBusiness: string = '';

  detallesList: { label: string, value: any }[] = [];

  constructor(
    private router: Router,
    private userService: User,
    private route: ActivatedRoute,
  ) {
    
  }

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUserById(this.id).subscribe({
      next: (user) => {

        console.log(user);

        this.nameOfBusiness = user.name || 'Sin nombre';

        this.detallesList = [
          { label: 'Nombre de ingreso', value: user.username },
          { label: 'Contraseña', value: '*********' },
          { label: 'Nombre de la empresa/admin', value: user.name },
          { label: 'Correo electrónico', value: user.email },
          { label: 'RUC', value: user.ruc },
          { label: 'Teléfono', value: user.phone },
          { label: 'Tipo de usuario', value: user.userType },
          { label: 'Correos en copia', value: user.ccEmails },
          { label: 'Tiempo de entrega (días)', value: user.leadTimeDays },
          { label: 'Productos usuales', value: user.usualProductsNotes },
          { label: 'Observaciones', value: user.observations },
          { label: 'Estado', value: user.status },
        ];
      }

    })
  }

  irAEditarUsuario() {
    this.router.navigate(['/admin/editar-usuario', this.id]);
  }

  volverListaUsuarios() {
    this.router.navigate(['/admin/lista-usuarios']);
  }

}