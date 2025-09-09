import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-a-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './a-header.html',
  styleUrl: './a-header.scss',
  standalone: true,
})
export class AHeader {

  menuOpen = false;

  showPedidosSubmenu = false;
  showReportesSubmenu = false;

  constructor(
    private router: Router,
    private AuthService: Auth,
    private cd: ChangeDetectorRef,
  ) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.menuOpen = false;
      this.cd.detectChanges();
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.cd.detectChanges();
    console.log('menuOpen:', this.menuOpen);
  }

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