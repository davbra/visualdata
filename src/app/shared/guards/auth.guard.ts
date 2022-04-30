import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private _Router: Router, private _AuthService: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.onVerifyAuth(state);
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.onVerifyAuth(state);
  }

  private onVerifyAuth(state: RouterStateSnapshot): boolean {
    const isAuth = this._AuthService.isAuthenticated;
    if (isAuth == true) {
      return true;
    }

    this._Router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  
}
