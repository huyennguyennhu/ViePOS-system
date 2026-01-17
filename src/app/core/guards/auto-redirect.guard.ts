import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const autoRedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const port = window.location.port;

  // Nếu truy cập trang gốc hoặc trang landing
  if (state.url === '/' || state.url === '/landing') {
    if (port === '4200') {
      router.navigate(['/user']);
      return false;
    } else if (port === '4201') {
      router.navigate(['/admin']);
      return false;
    }
  }

  return true;
};
