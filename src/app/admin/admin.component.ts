import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { get } from 'scriptjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {

  pageTitle;
  hideCompanyFilter:boolean;

  constructor(private _Router:Router,private _ActivatedRoute:ActivatedRoute ) {
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

  ngAfterViewInit() {
    get("./assets/js/inspinia.js", () => { });
  }
}
