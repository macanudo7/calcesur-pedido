import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CHeader } from '../../shared/shared';

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, CHeader],
  template: `
    <app-c-header tipo="cliente"></app-c-header>
    <router-outlet></router-outlet>
    <div class="footer">© 2025 CALCESUR S. A. Todos los derechos reservados</div>
  `,
  styleUrl: './client-layout.scss'
})
export class ClientLayout {

}
