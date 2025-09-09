import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalConfirmacion } from '../../shared/components/modal-confirmacion/modal-confirmacion';
import { User } from '../../services/user';

@Component({
  selector: 'app-a-agregar-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalConfirmacion],
  templateUrl: './a-agregar-usuario.html',
  styleUrl: './a-agregar-usuario.scss'
})
export class AAgregarUsuario implements OnInit {

  userForm: FormGroup;
  isEditMode = false;
  userId?: number;
  nameOfUser: string = sessionStorage.getItem('userName') || '';
  titleModalExito: string = "";

  typeError: string | null = null;
  showError: boolean = false;

  newUser: string = '';
  newPassword: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: User,
    private cd: ChangeDetectorRef,
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
      user_code: [''], 
      status: ['', Validators.required],
      ruc: ['', Validators.maxLength(11)],
      leadTimeDays: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.userId = +id;

        this.userService.getUserById(this.userId).subscribe(user => {
          this.userForm.patchValue(user);
        });
      }
    });

    this.titleModalExito = this.isEditMode ? 'Se actualizó los datos del usuario con éxito' : 'Se ha creado el usuario con éxito';
  }


  mostrarModalExito:boolean = false;

  submit() {

    this.showError = false;
    this.typeError = null;
    this.cd.detectChanges();

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
        user_code: this.userForm.value.user_code,
        ruc: this.userForm.value.ruc,
        leadTimeDays: this.userForm.value.leadTimeDays,
      };

      const action = this.isEditMode 
        ? this.userService.updateUser(this.userId!, vUsers)
        : this.userService.createUser(vUsers);

      action.subscribe({
        next: (res) => {
          console.log('guardado:', res);
          this.newUser = this.userForm.value.username;
          this.newPassword = this.userForm.value.password;
          this.mostrarModalExitoso();
        },
        error: (err) => {
          this.showError = true;
          this.typeError = err.error?.message || 'Hubo un error, revisa tus datos.';

          console.error('Error al guardar el vehículo', err);
        }
      });

      // this.mostrarModalExitoso();

    } else {
      this.userForm.markAllAsTouched();
    }
  }

  copyToClipboard(username: string, password: string) {
    const textToCopy = `Usuario: ${username}\nContraseña: ${password}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log('Texto copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar al portapapeles', err);
    });
  }

  // MODAL DE ÉXITO

  mostrarModalExitoso() {
    this.mostrarModalExito = true;
    this.cd.detectChanges();
  }

  irAListaUsuarios() {
    this.mostrarModalExito = false;
    this.router.navigate(['/admin/lista-usuarios']);
  }


  // MODAL DE CONFIRMACIÓN

  mostrarModalConfirmacion = false;

  volverListaUsuarios() {
    if (this.userForm.dirty || this.userForm.touched) {
      this.mostrarModalConfirmacion = true;
    } else {
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
