import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../services/user';
import { UserForm } from '../../shared/interfaces/user.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';

@Component({
  selector: 'app-a-lista-usuarios',
  imports: [CommonModule, ModalConfirmacion, FormsModule],
  templateUrl: './a-lista-usuarios.html',
  styleUrl: './a-lista-usuarios.scss',
  standalone: true,
})
export class AListaUsuarios implements OnInit {

  nameOfUser: string = sessionStorage.getItem('userName') || '';

  // users$: Observable<UserForm[]>;

  users$: Observable<UserForm[]> = new Observable<UserForm[]>();
  allUsers: UserForm[] = [];
  filteredUsers: UserForm[] = [];

  searchTerm: string = '';
  selectedUserType: string = '';

  userTypes = [
    { value: 'client', label: 'Cliente' },
    { value: 'admin',  label: 'Administrador' },
    { value: 'editor', label: 'Editor' },
  ];

  userTypeMap: Record<string, string> = {
    client: 'Cliente',
    admin: 'Administrador',
    editor: 'Editor'
  };

  constructor(
    private router: Router,
    private userService: User
  ) {
    this.users$ = this.userService.users$;
  }

  ngOnInit(): void {
    this.userService.getUsers();

    this.users$.subscribe(users => {
      this.allUsers = users;
      this.filteredUsers = users;
    });

  }

  irAgregarUsuario() {
    this.router.navigate(['/admin/agregar-usuario']);
  }

  // FILTRAR USUARIOS (buscador + tipo)

  filterUsers() {
    const term = this.searchTerm.trim().toLowerCase();
    const type = this.selectedUserType;

    this.filteredUsers = this.allUsers.filter(u => {
      const matchesName = term ? u.username.toLowerCase().includes(term) : true;
      const matchesType = type ? u.userType === type : true;
      return matchesName && matchesType;
    });
  }

  // MODAL DE CONFIRMACIÓN

  mostrarModalEliminacion = false;
  idUser? = 0;

  deleteUser(id?: number) {
    this.mostrarModalEliminacion = true;
    this.idUser = id;
  }

  // ELIMINAR USUARIO

  confirmarEliminar() {
    if (this.idUser) {
      this.userService.deleteUser(this.idUser).subscribe({
        next: () => {
          this.mostrarModalEliminacion = false;
          console.log('Usuario eliminado con éxito.');
        },
        error: (error) => {
          console.error('Hubo un error al eliminar el usuario:', error);
        }
      });
    } else {
      console.error('No se pudo obtener el ID del usuario para eliminar.');
    }
  }

  cancelarEliminacion() {
    this.mostrarModalEliminacion = false;
  }

  // EDITAR AL USUARIO

  editUser(id?: number) {
    if (id) {
      this.router.navigate(['/admin/editar-usuario', id]);
    }
  }

  // Ver detalles de USUARIO

  verUser(id?: number) {
    if (id) {
      this.router.navigate(['/admin/ver-detalles-usuario', id]);
    }
  }
}
