import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';
import { User } from '../../services/user';

@Component({
  selector: 'app-a-agregar-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalConfirmacion],
  templateUrl: './a-agregar-usuario.html',
  styleUrl: './a-agregar-usuario.scss'
})
export class AAgregarUsuario {

  userForm: FormGroup;
  isEditMode = false;
  userId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: User,
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(100)]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      observations: [''],
      usualProductsNotes: [''],
      ccEmails: [''],
      password: ['', [Validators.required, Validators.maxLength(255)]],
      phone: ['', Validators.maxLength(50)],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      userType: ['', Validators.required],
      status: ['', Validators.required],
      ruc: ['', Validators.maxLength(11)],
      leadTimeDays: [''],
    });
  }

  mostrarModalExito:boolean = false;

  submit() {
    if (this.userForm.valid) {
      const vUsers = {
        username: this.userForm.value.username,
        name: this.userForm.value.name,
        observations: this.userForm.value.observations,
        usualProductsNotes: this.userForm.value.usualProductsNotes,
        ccEmails: this.userForm.value.ccEmails,
        password: this.userForm.value.password,
        phone: this.userForm.value.phone,
        email: this.userForm.value.email,
        userType: this.userForm.value.userType,
        status: this.userForm.value.status,
        ruc: this.userForm.value.ruc,
        leadTimeDays: this.userForm.value.leadTimeDays,
      };

      const action = this.isEditMode 
        ? this.userService.updateUser(this.userId!, vUsers) // <-- Llama a update
        : this.userService.createUser(vUsers);

      action.subscribe({
        next: (res) => {
          console.log('guardado:', res);
        },
        error: (err) => {
          console.error('Error al guardar el vehículo', err);
        }
      });

    } else {
      this.userForm.markAllAsTouched();
    }
  }


  // MODAL DE CONFIRMACIÓN

  mostrarModalConfirmacion = false;

  volverListaUsuarios() {
    if (this.userForm.dirty || this.userForm.touched) {
      console.log('Mostrando modal de confirmación');
      this.mostrarModalConfirmacion = true;
    } else {
      console.log('Mostrando aaaaaaaaa');
      this.router.navigate(['/admin/lista-usuarios']);
    }
  }

  confirmarVolver() {
    this.mostrarModalConfirmacion = false;
    this.router.navigate(['/admin/lista-usuarios']);
  }

  cancelarVolver() {
    this.mostrarModalConfirmacion = false;
  }

}
