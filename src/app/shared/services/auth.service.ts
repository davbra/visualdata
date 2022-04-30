import { AuthUserModel } from './../models/auth-user.model';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { Router } from '@angular/router';
import { RoleEnum } from '../enums/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<AuthUserModel>;

  get isAuthenticated() {
    return this.currentUserSubject.value == null ? false : true;
  }

  get userRole(): RoleEnum {
    return this.currentUserSubject.value == null ? null : this.currentUserSubject.value.role;
  }

  get currentUser(): BehaviorSubject<AuthUserModel> {
    return this.currentUserSubject;
  }

  constructor(private _Router: Router, private _ToastrManager: ToastrManager) {
    this.currentUserSubject = new BehaviorSubject<AuthUserModel>(JSON.parse(localStorage.getItem('currentUser')));
  }

  login(model: LoginModel) {
    var userNameArr = ['client', 'editor'];

    return new Observable<AuthUserModel>(obs => {
      if (userNameArr.indexOf(model.UserName.toLowerCase()) > -1 && model.Password == '123456') {
        var currentUser: AuthUserModel = { userName: model.UserName.toLowerCase(), password: model.Password, role: null };

        if (currentUser.userName == "client") {
          currentUser.role = RoleEnum.Client;
        } else if (currentUser.userName == "editor") {
          currentUser.role = RoleEnum.Editor;
        }

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
        obs.next(currentUser);
        obs.complete();
      } else {
        this._ToastrManager.errorToastr('Password or userName is not valid');
      }
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this._Router.navigateByUrl('/login');
  }
}
