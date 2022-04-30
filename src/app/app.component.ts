import { InitialService } from './shared/services/initial.service';
import { CompanyService } from './shared/services/company.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { get } from 'scriptjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit  {

  title = 'report-addin';

  constructor(private _InitialService:InitialService){
  }

  ngOnInit(): void {
    this._InitialService.initial();
  }

  ngAfterViewInit() {
    get("./assets/js/inspinia.js", () => { });
  }
}

