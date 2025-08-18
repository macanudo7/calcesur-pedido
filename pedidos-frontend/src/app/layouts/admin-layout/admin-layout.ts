import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AHeader } from '../../shared/shared';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AHeader],
  template: `
    <app-a-header tipo="admin"></app-a-header>
    <router-outlet></router-outlet>
    <div class="footer">© 2025 CALCESUR S. A. Todos los derechos reservados</div>
  `,
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {

}
