import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CHeader } from '../../shared/shared';

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, CHeader],
  template: `
    <app-c-header tipo="cliente"></app-c-header>
    <router-outlet></router-outlet>
  `,
  styleUrl: './client-layout.scss'
})
export class ClientLayout {

}
