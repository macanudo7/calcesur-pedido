import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-c-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './c-login.html',
  styleUrl: './c-login.scss'
})
export class CLogin {

  authForm: FormGroup;
  typeError: string | null = null;
  showError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Auth,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
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

    this.showError = false;
    this.typeError = null;
    this.cd.detectChanges();

    if (this.authForm.valid) {
      const credentials = {
        identifier: this.authForm.value.username,
        password: this.authForm.value.password,
        userType: 'client'
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          // this.typeError = "";
          this.showError = false;
          console.log('Login exitoso', response);
          this.router.navigate(['/cliente/generar-pedido']);

          this.cd.detectChanges();
        },
        error: (err) => {

          this.showError = true;
          this.typeError = err.error?.message || 'Las credenciales no existen o son inválidas.';

          this.cd.detectChanges();

          console.error('Error en login', err)
        }
      });
    } else {
      this.authForm.markAllAsTouched();
    }

  }

}
