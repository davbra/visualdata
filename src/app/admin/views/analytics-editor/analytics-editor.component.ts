import { AnalyticsDetailService } from './../../../shared/services/analytics-detail.service';
import { AddReportDetailsPopupComponent } from './../../components/add-report-details-popup/add-report-details-popup.component';
import { AddAnalyticsPopupComponent } from './../../components/add-analytics-popup/add-analytics-popup.component';
import { AnalyticsTypeService } from './../../../shared/services/analytics-type.service';
import { CompanyDto } from './../../../shared/dtos/company.dto';
import { AnalyticsEditorTopicInfoModel } from './analytics-editor-topic-info.model';
import { AnalyticsEditorFormInterface } from './../../../shared/form-interfaces/analytics-editor.form-interface';
import { AnalyticsDto } from './../../../shared/dtos/analytics.dto';
import { AnalyticsService } from './../../../shared/services/analytics.service';
import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AnalyticsArrFilter } from 'src/app/shared/filters/analytics-arr.filter';
import { FormGroup, FormBuilder } from '@ng-stack/forms';
import { Sort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, map, pairwise, take, takeUntil, tap } from 'rxjs/operators';
import { CompanyService } from 'src/app/shared/services/company.service';
import { AnalyticsTypeDto } from 'src/app/shared/dtos/analytics-type.dto';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DataSharingService } from 'src/app/shared/services/data-sharing.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-analytics-editor',
  templateUrl: './analytics-editor.component.html',
  styleUrls: ['./analytics-editor.component.scss']
})
export class AnalyticsEditorComponent implements OnInit, OnDestroy {

  publishTypeArr = [
    { id: true, name: 'Yes, published' },
    { id: false, name: 'Not published' }
  ];
  promoteTypeArr = [
    { id: true, name: 'Yes, promoted' },
    { id: false, name: 'Not promoted' }
  ];

  loadingMoreCount: number = 50;
  rForm: FormGroup<AnalyticsEditorFormInterface>;
  analyticsArr: AnalyticsDto[];
  companyArr: CompanyDto[];
  analyticsTypeArr: AnalyticsTypeDto[];

  get totalSelectedAnalytics() {
    if (this.analyticsArr != null) {
      var length = this.analyticsArr.filter(x => x.isSelected == true).length;
      return length == 1 ? 0 : length;
    }
    return 0;
  }

  destroyNotify = new Subject()

  @ViewChild('addAnalyticsPopup', { static: false }) addAnalyticsPopup: AddAnalyticsPopupComponent;

  @HostListener('document:keydown.alt.a', ['$event'])
  keyEvent(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key == "a") {
      this.showAddAnalyticsPopup();
    }
  }

  constructor(private _AnalyticsService: AnalyticsService, private _FormBuilder: FormBuilder,
    private _CompanyService: CompanyService, private _AnalyticsTypeService: AnalyticsTypeService,
    private _ToastrManager: ToastrManager, private _DataSharingService: DataSharingService,
    private _AnalyticsDetailService: AnalyticsDetailService) { }

  ngOnInit(): void {
    this.rForm = this._FormBuilder.group<AnalyticsEditorFormInterface>({
      documentName: [null],
      companyId: [null],
      analyticsTypeId: [null],
      skip: [0],
      take: [this.loadingMoreCount],
      count: [0],
      orderBy: [null],
      isSelectAll: [false],
      isPublish: [null],
      isPromote: [null],
      analyst: [null]
    });

    this.rForm.get('documentName').valueChanges.pipe().pipe(
      debounceTime(50),
      distinctUntilChanged(),
    ).pipe(takeUntil(this.destroyNotify)).subscribe((value) => {
      this.getData();
    });

    this.rForm.get('companyId').valueChanges.pipe().pipe(
      debounceTime(50)
    ).pipe(takeUntil(this.destroyNotify)).subscribe((value) => {
      this.getData();
    });

    this.rForm.get('analyticsTypeId').valueChanges.pipe().pipe(
      debounceTime(50)
    ).pipe(takeUntil(this.destroyNotify)).subscribe((value) => {
      this.getData();
    });

    this.rForm.get('isSelectAll').valueChanges.pipe(takeUntil(this.destroyNotify)).subscribe((value) => {
      if (value != null) {
        this.onChangeSelectAll(value);
      }
    });

    this.rForm.get('isPublish').valueChanges.pipe(takeUntil(this.destroyNotify)).pipe(
      debounceTime(50)
    ).subscribe((value) => {
      this.getData();
    });

    this.rForm.get('isPromote').valueChanges.pipe(takeUntil(this.destroyNotify)).pipe(
      debounceTime(50)
    ).subscribe((value) => {
      this.getData();
    });

    this.rForm.get('analyst').valueChanges.pipe(takeUntil(this.destroyNotify)).pipe(
      debounceTime(50)
    ).subscribe((value) => {
      this.getData();
    });

    this._DataSharingService.customerIdArrObserv.pipe(pairwise(),
      takeUntil(this.destroyNotify)).subscribe(([prev, curr]) => {
        if (prev != null || curr != null) {
          const formValue = this.rForm.value;
          var filter: AnalyticsArrFilter = {
            documentName: formValue.documentName,
            companyId: curr,
            analyticsTypeId: formValue.analyticsTypeId,
            isPublish: formValue.isPublish,
            isPromote: formValue.isPromote,
            skip: formValue.skip,
            take: formValue.take,
            orderBy: formValue.orderBy,
            analyst: formValue.analyst
          };

          this.getData(filter);
        }
      });

    this._DataSharingService.searchObserv.pipe(takeUntil(this.destroyNotify)).subscribe(value => {
      const formValue = this.rForm.value;
      var filter: AnalyticsArrFilter = {
        documentName: value,
        companyId: formValue.companyId,
        analyticsTypeId: formValue.analyticsTypeId,
        isPublish: formValue.isPublish,
        isPromote: formValue.isPromote,
        skip: formValue.skip,
        take: formValue.take,
        orderBy: formValue.orderBy,
        analyst: formValue.analyst
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
    if (event.target.localName == "td" || event.target.localName == "a" || event.currentTarget.className.toString().indexOf('btn-collapse') > -1
      || event.currentTarget.parentNode.className.toString().indexOf('btn-collapse') > -1) {
      item.isShowDetails = item.isShowDetails == true ? false : true;
    }
  }

  onSort(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  trackById(index: number, item: AnalyticsDto) {
    return item.id;
  }
  showAddAnalyticsPopup(id = null) {
    this.addAnalyticsPopup.showPopup(id);
    this.addAnalyticsPopup.emitter.subscribe((analyticsId) => {
      this.getData();
    });
  }

  onChangeSelectAll(isSelect: boolean) {
    this.analyticsArr.forEach(x => x.isSelected = isSelect);
  }

  duplicate(item: AnalyticsDto) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Duplicate Report',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Duplicate it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._AnalyticsService.get(item.id).pipe(takeUntil(this.destroyNotify)).subscribe(model => {
          model.promote = false;
          model.publish = false;
          this._AnalyticsService.create(model).pipe(takeUntil(this.destroyNotify)).subscribe(() => {
            this._ToastrManager.successToastr("Duplicate record has been successfully");
            this.getData();
          });
        });
      }
    });
  }

  duplicateSelectedRecords() {
    var arr = this.analyticsArr.filter(x => x.isSelected == true);
    Swal.fire({
      title: 'Are you sure?',
      text: `Duplicate ${arr.length} Report`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Duplicate it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        arr.forEach((item, index) => {
          this._AnalyticsService.get(item.id).subscribe(model => {
            model.promote = false;
            model.publish = false;
            this._AnalyticsService.create(model).pipe(takeUntil(this.destroyNotify)).subscribe(() => {
              if (index == (arr.length - 1)) {
                this._ToastrManager.successToastr(`Duplicate ${arr.length} record has been successfully`);
                this.getData();
              }
            });
          });
        })
      }
    });
  }

  update(item: AnalyticsDto) {
    this._AnalyticsService.get(item.id).pipe(takeUntil(this.destroyNotify)).subscribe(model => {
      model.promote = item.promote || false;
      model.publish = item.publish || false;
      this._AnalyticsService.update(model).pipe(takeUntil(this.destroyNotify)).subscribe();
    });
  }

  delete(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to delete Report',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._AnalyticsService.delete(id).pipe(takeUntil(this.destroyNotify)).subscribe(model => {
          this._ToastrManager.successToastr("record has been deleted successfully");
          this.getData();
        });
      }
    });
  }

  deleteSelectedRecords() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete Report',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        var arr = [...this.analyticsArr.filter(x => x.isSelected == true)];
        arr.forEach((item, index) => {
          this._AnalyticsService.delete(item.id).pipe(takeUntil(this.destroyNotify)).subscribe(model => {
            if (index == (arr.length - 1)) {
              this._ToastrManager.successToastr(`${arr.length} record has been deleted successfully`);
              this.getData();
            }
          });
        });
      }
    });

  }

  getTopicData(item: AnalyticsDto): AnalyticsEditorTopicInfoModel {
    var topicInfo: AnalyticsEditorTopicInfoModel = {
      companyArr: [],
      count: 0
    };

    for (let index = 0; index < item.primaryCompanyArr.length; index++) {
      if (topicInfo.companyArr.length < 2) {
        if (item.primaryCompanyArr[index] != undefined) {
          topicInfo.companyArr.push({ id: item.primaryCompanyArr[index].id, name: item.primaryCompanyArr[index].name, isPrimary: true })
        }
      } else {
        topicInfo.count += 1;
      }
    }

    for (let index = 0; index < item.secondaryCompanyArr.length; index++) {
      if (topicInfo.companyArr.length < 2) {
        if (item.secondaryCompanyArr[index] != undefined) {
          topicInfo.companyArr.push({ id: item.secondaryCompanyArr[index].id, name: item.secondaryCompanyArr[index].name, isPrimary: false })
        }
      } else {
        topicInfo.count += 1;
      }
    }

    return topicInfo;
  }

  onLoadMore() {
    const formValue = this.rForm.value;
    this.rForm.patchValue({
      skip: 0,
      take: formValue.count > (formValue.take + this.loadingMoreCount) ? formValue.take + this.loadingMoreCount : formValue.count
    });
    this.getData();
  }

  private getData(filter: AnalyticsArrFilter = null) {
    const formValue = this.rForm.value;
    if (filter == null) {
      filter = {
        documentName: formValue.documentName,
        companyId: formValue.companyId,
        analyticsTypeId: formValue.analyticsTypeId,
        isPublish: formValue.isPublish,
        isPromote: formValue.isPromote,
        skip: formValue.skip,
        take: formValue.take,
        orderBy: formValue.orderBy,
        analyst: formValue.analyst
      };
    }


    this._AnalyticsService.getArr(filter).pipe(take(1)).pipe(takeUntil(this.destroyNotify)).pipe(map(arr => {
      var companyArr = [];
      arr.forEach(x => {
        companyArr = [...companyArr, ...x.primaryCompanyArr , ...x.secondaryCompanyArr]
      });

      this.companyArr = companyArr.filter((v, i, a) => a.indexOf(v) === i);

      return arr;
    })).subscribe(arr => {
      this.analyticsArr = arr;
    }, err => { }, () => {
      this._AnalyticsService.count().then(count => {
        this.rForm.get('count').setValue(count);
      });

      setTimeout(() => {
        $(".document-name").unmark();
        if (formValue.documentName != null) {
          $(".document-name").mark(formValue.documentName);
        }
      }, 1000);
    });
  }

  private initialData() {

    this._AnalyticsTypeService.getAll().pipe(takeUntil(this.destroyNotify)).subscribe(arr => {
      this.analyticsTypeArr = arr;
    });
  }

}
