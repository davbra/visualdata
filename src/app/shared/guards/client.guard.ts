import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleEnum } from '../enums/role.enum';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  constructor(private _Router: Router, private _AuthService: AuthService) {
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.onVerifyAuth(state);
  }

  private onVerifyAuth(state: RouterStateSnapshot): boolean {
    const userRole = this._AuthService.userRole;
    if (userRole == RoleEnum.Client) {
      return true;
    }

    this._Router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
}
