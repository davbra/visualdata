import { DataSharingService } from './../../../shared/services/data-sharing.service';
import { CompanyDto } from './../../../shared/dtos/company.dto';
import { Component, Input, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/shared/services/company.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header-details',
  templateUrl: './header-details.component.html',
  styleUrls: ['./header-details.component.scss']
})
export class HeaderDetailsComponent implements OnInit {

  rForm: FormGroup;
  companyArr: CompanyDto[];

  @Input() hidecompanyFilter: boolean = false;

  constructor(private _CompanyService: CompanyService, private _DataSharingService: DataSharingService,
    private _FormBuilder: FormBuilder, private _Router: Router) {
  }

  ngOnInit() {
    this.rForm = this._FormBuilder.group({
      companyIdArr: [null],
      text: [null]
    });

    this.rForm.get('companyIdArr').valueChanges.subscribe(value => {
      this._DataSharingService.setCustomerIdArr(value);
    });

    this.rForm.get('text').valueChanges.subscribe(value => {
      this._DataSharingService.setSearch(value);
    });

    this._Router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((route: ActivatedRoute) => {
      this.rForm.patchValue({
        companyIdArr: null,
        text: null
      });
    });

    this.getData();
  }

  private getData() {
    this._CompanyService.getAll().subscribe(arr => {
      this.companyArr = arr;
    });
  }

}
