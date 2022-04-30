import { AuthService } from './../../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  pageTitle;
  hideCompanyFilter:boolean;

  constructor(private _Router:Router,private _ActivatedRoute:ActivatedRoute ,
    private _AuthService:AuthService ) {
  }

 ngOnInit() {

   if (this._Router.navigated) {
     if(this._ActivatedRoute.snapshot.firstChild != null){
     this.pageTitle = this._ActivatedRoute.snapshot.firstChild.data.pageTitle;
     this.hideCompanyFilter =  this._ActivatedRoute.snapshot.firstChild.data.hideCompanyFilter;
     }
   }

   this._Router.events.pipe( filter(event => event instanceof NavigationEnd) ).subscribe((route: ActivatedRoute) => {
     this.pageTitle = this._ActivatedRoute.snapshot.firstChild.data.pageTitle;
     this.hideCompanyFilter =  this._ActivatedRoute.snapshot.firstChild.data.hideCompanyFilter;
   });
 }

  logout(){
    this._AuthService.logout();
  }

}
