import { Component } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-c-header',
  imports: [RouterModule],
  templateUrl: './c-header.html',
  styleUrl: './c-header.scss',
  standalone: true
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
