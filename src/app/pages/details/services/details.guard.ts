import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot , RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DetailsGuard implements CanActivate{

  constructor(private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (route.queryParams.lat && route.queryParams.lon) {
      return true

    }

    return this.router.createUrlTree(['/']);
  }
}
