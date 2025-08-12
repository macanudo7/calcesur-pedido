import { Component } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-c-header',
  imports: [],
  templateUrl: './c-header.html',
  styleUrl: './c-header.scss'
})
export class CHeader {

  constructor(
    private router: Router,
    private AuthService: Auth,
  ) {}

  logOut() {
    this.AuthService.logout();
    this.router.navigate(['/ingreso']);
  }

}
