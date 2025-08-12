import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Auth,
  ) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  // ================= Olvidar contraseña
  mostrarModal = false;

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  // ================= Loguearse

  login() {

    if (this.authForm.valid) {
      const credentials = {
        identifier: this.authForm.value.username,
        password: this.authForm.value.password,
        userType: 'admin'
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login exitoso', response);
          this.router.navigate(['/admin/pedidos-por-entregar']);
        },
        error: (error) => {
          console.error('Error en login', error);
        }
      });
    } else {
      this.authForm.markAllAsTouched();
    }

  }

}
