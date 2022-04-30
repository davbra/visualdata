import { DataSharingService } from 'src/app/shared/services/data-sharing.service';
import { CompanyDto } from './../../../shared/dtos/company.dto';
import { AnalyticsFormInterface } from './../../../shared/form-interfaces/analytics.form-interface';
import { AnalyticsArrFilter } from './../../../shared/filters/analytics-arr.filter';
import { AddAnalyticsPopupComponent } from './../../components/add-analytics-popup/add-analytics-popup.component';
import { AnalyticsDto } from './../../../shared/dtos/analytics.dto';
import { AnalyticsService } from './../../../shared/services/analytics.service';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@ng-stack/forms';
import { Sort } from '@angular/material/sort';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { map, take, takeUntil } from 'rxjs/operators';
import { CompanyService } from 'src/app/shared/services/company.service';
import { AnalyticsTypeDto } from 'src/app/shared/dtos/analytics-type.dto';
import { AnalyticsTypeService } from 'src/app/shared/services/analytics-type.service';
import { Subject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {

  flag = -1;
  loadingMoreCount: number = 50;
  rForm: FormGroup<AnalyticsFormInterface>;
  anaylysticsArr: AnalyticsDto[];
  companyArr: CompanyDto[];
  analyticsTypeArr: AnalyticsTypeDto[];

  destroyNotify = new Subject()

  @ViewChild('addAnalyticsPopup', { static: false }) addAnalyticsPopup: AddAnalyticsPopupComponent;

  constructor(private _FormBuilder: FormBuilder, private _AnalyticsService: AnalyticsService,
    private _CompanyService: CompanyService, private _DataSharingService: DataSharingService,
    private _AnalyticsTypeService: AnalyticsTypeService) { }

  ngOnInit(): void {
    this.rForm = this._FormBuilder.group<AnalyticsFormInterface>({
      flag: [null],
      documentName: [null],
      companyId: [null],
      skip: [0],
      take: [this.loadingMoreCount],
      count: [0],
      orderBy: [null],
      analyticsTypeId: [null]
    });

    this.rForm.get('documentName').valueChanges.pipe().pipe(
      debounceTime(100),
      distinctUntilChanged(),
    ).pipe(takeUntil(this.destroyNotify)).subscribe((value) => {
      this.getData();
    });

    this.rForm.get('companyId').valueChanges.pipe().pipe(takeUntil(this.destroyNotify)).pipe(
      debounceTime(100)
    ).subscribe((value) => {
      this.getData();
    });

    this.rForm.get('analyticsTypeId').valueChanges.pipe().pipe(takeUntil(this.destroyNotify)).pipe(
      debounceTime(100)
    ).subscribe((value) => {
      this.getData();
    });

    this.rForm.get('flag').valueChanges.pipe().pipe(takeUntil(this.destroyNotify)).pipe(
      debounceTime(100)
    ).subscribe((value) => {
      this.getData();
    });

    this._DataSharingService.customerIdArrObserv.pipe(takeUntil(this.destroyNotify)).subscribe(value => {
      const formValue = this.rForm.value;
      var filter: AnalyticsArrFilter = {
        documentName: formValue.documentName,
        companyId: value,
        skip: formValue.skip,
        take: formValue.take,
        orderBy: formValue.orderBy,
        analyticsTypeId: formValue.analyticsTypeId
      };

      this.getData(filter);
    });

    this._DataSharingService.searchObserv.pipe(takeUntil(this.destroyNotify)).subscribe(value => {
      const formValue = this.rForm.value;
      var filter: AnalyticsArrFilter = {
        documentName: value,
        companyId: formValue.companyId,
        skip: formValue.skip,
        take: formValue.take,
        orderBy: formValue.orderBy,
        analyticsTypeId: formValue.analyticsTypeId
      };

      this.getData(filter);
    });

    this.initialData();
    this.getData();
  }

  ngOnDestroy(): void {
    this.destroyNotify.next();
    this.destroyNotify.complete();
  }

  foldToggle(event, item: AnalyticsDto) {
    if (event.target.localName == "td" || event.target.localName == "a") {
      item.isShowDetails = item.isShowDetails == true ? false : true;

      setTimeout(() => {
        $(event.target).parent().toggleClass("open").next(".fold").toggleClass("open");
      });
    }
  }

  onChangeFlag() {
    var flag = this.flag == -1 ? null : this.flag;
    this.rForm.controls.flag.setValue(flag);
  }

  updateFlag(item: AnalyticsDto) {
    item.flag = item.flag >= 2 ? 0 : item.flag + 1;
    this.updateAnalystics(item);
  }

  onLoadMore() {
    const formValue = this.rForm.value;
    this.rForm.patchValue({
      skip: 0,
      take: formValue.count > (formValue.take + this.loadingMoreCount) ? formValue.take + this.loadingMoreCount : formValue.count
    });
    this.getData();
  }

  onSort(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  trackById(index: number, item: AnalyticsDto) {
    return item.id;
  }

  private updateAnalystics(item: AnalyticsDto) {
    this._AnalyticsService.get(item.id).pipe(takeUntil(this.destroyNotify)).subscribe(model => {
      model.flag = item.flag;
      this._AnalyticsService.update(model).pipe(takeUntil(this.destroyNotify)).subscribe();
    });
  }

  private getData(filter: AnalyticsArrFilter = null) {
    const formValue = this.rForm.value;
    if (filter == null) {
      filter = {
        flag: formValue.flag,
        documentName: formValue.documentName,
        companyId: formValue.companyId,
        skip: formValue.skip,
        take: formValue.take,
        orderBy: formValue.orderBy,
        analyticsTypeId: formValue.analyticsTypeId,
      };
    }

    filter.isPublish = true;

    $(".document-name").unmark();
    var companyArr = [];
    this._AnalyticsService.getArr(filter).pipe(take(1)).pipe(takeUntil(this.destroyNotify)).pipe(map(arr => {
      arr.forEach(x => {
        companyArr = [...companyArr, ...x.primaryCompanyArr]
      });

      this.companyArr = companyArr.filter((v, i, a) => a.indexOf(v) === i);

      return arr;
    })).subscribe(arr => {
      this.anaylysticsArr = arr;
    }, err => { }, () => {
      setTimeout(() => {
        $(".document-name").unmark();
        if (formValue.documentName != null) {
          $(".document-name").mark(formValue.documentName);
        }
      }, 1000);
    });
  }

  private initialData() {
    this._AnalyticsService.count().then(count => {
      this.rForm.get('count').setValue(count);
    })

    this._AnalyticsTypeService.getAll().pipe(takeUntil(this.destroyNotify)).subscribe(arr => {
      this.analyticsTypeArr = arr;
    });
  }

}
