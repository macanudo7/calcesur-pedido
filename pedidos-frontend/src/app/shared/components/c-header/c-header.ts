import { Component, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-c-header',
  imports: [RouterModule],
  templateUrl: './c-header.html',
  styleUrl: './c-header.scss',
  standalone: true
})
export class CHeader {

  menuOpen = false;

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
    this.router.navigate(['/ingreso']);
  }

}
