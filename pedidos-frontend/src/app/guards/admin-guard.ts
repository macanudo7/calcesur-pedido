import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateChildFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.getRole() === 'admin') {
    return true;
  }

  router.navigate(['/cliente']);
  return false;
};
