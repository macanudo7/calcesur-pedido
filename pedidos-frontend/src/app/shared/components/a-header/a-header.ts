import { Component } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-a-header',
  imports: [],
  templateUrl: './a-header.html',
  styleUrl: './a-header.scss'
})
export class AHeader {

  constructor(
    private router: Router,
    private AuthService: Auth,
  ) {}

  logOut() {
    this.AuthService.logout();
    this.router.navigate(['/ingreso-admin']);
  }

}