import { get } from 'scriptjs';
import { RoleEnum } from './../../../shared/enums/role.enum';
import { AuthService } from './../../../shared/services/auth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit , AfterViewInit{

  get userRole() {
    return this._AuthService.userRole;
  }

  get roleEnum() {
    return RoleEnum;
  }

  constructor(private _AuthService: AuthService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    get("./assets/js/inspinia.js", () => { });
  }

  logout(){
    this._AuthService.logout();
  }

}