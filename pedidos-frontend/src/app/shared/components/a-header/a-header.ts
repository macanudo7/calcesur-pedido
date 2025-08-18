import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-a-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './a-header.html',
  styleUrl: './a-header.scss',
  standalone: true,
})
export class AHeader {

  showPedidosSubmenu = false;
  showReportesSubmenu = false;

  constructor(
    private router: Router,
    private AuthService: Auth,
    private cd: ChangeDetectorRef,
  ) {}

  logOut() {
    this.AuthService.logout();
    this.router.navigate(['/ingreso-admin']);
  }

  togglePedidosSubmenu() {
    this.showPedidosSubmenu = !this.showPedidosSubmenu;
    this.showReportesSubmenu = false;
    this.cd.detectChanges();
  }

  toggleReportesSubmenu() {
    this.showReportesSubmenu = !this.showReportesSubmenu;
    this.showPedidosSubmenu = false;
    this.cd.detectChanges();
  }

}