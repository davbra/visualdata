import { CompaniesArrFilter } from './../../../shared/filters/companies-arr.filter';
import { AddCompanyPopupComponent } from './../../components/add-company-popup/add-company-popup.component';
import { CompanyService } from 'src/app/shared/services/company.service';
import { CompaniesFormInterface } from './../../../shared/form-interfaces/companies.form-interface';
import { FormBuilder, FormGroup } from '@ng-stack/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { CompanyDto } from 'src/app/shared/dtos/company.dto';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var  $:any;

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  loadingMoreCount=50;
  companyArr: CompanyDto[];
  rForm: FormGroup<CompaniesFormInterface>;
  companyTypeArr = [{ id: true, name: 'Primary' }, { id: false, name: 'Secondary' }];

  destroyNotify = new Subject()

  get totalSelectedCompanies() {
    if (this.companyArr != null) {
      var length = this.companyArr.filter(x => x.isSelected == true).length;
      return length == 1 ? 0 : length;
    }
    return 0;
  }

  @ViewChild('addCompanyPopup', { static: false }) addCompanyPopup: AddCompanyPopupComponent;

  constructor(private _FormBuilder: FormBuilder, private _CompanyService: CompanyService,
    private _ToastrManager: ToastrManager) { }

  ngOnInit(): void {
    this.rForm = this._FormBuilder.group<CompaniesFormInterface>({
      name: [null],
      isPrimary: [null],
      isSelectAll: [null],
      skip: [0],
      take: [this.loadingMoreCount],
      count: [null],
      orderBy: [null]
    });

    this.rForm.get('name').valueChanges.pipe().pipe(
      debounceTime(50),
      distinctUntilChanged(),
    ).pipe(takeUntil(this.destroyNotify)).subscribe((value) => {
      this.getData();
    });

    this.rForm.get('isPrimary').valueChanges.pipe().pipe(takeUntil(this.destroyNotify)).pipe(
      debounceTime(50)
    ).subscribe((value) => {
      this.getData();
    });

    this.rForm.get('isSelectAll').valueChanges.pipe().pipe(takeUntil(this.destroyNotify)).subscribe((value) => {
      if (value != null) {
        this.onChangeSelectAll(value);
      }
    });

    this.getData();
  }

  onSort(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  onLoadMore() {

  }

  trackById(index: number, item: CompanyDto) {
    return item.id;
  }

  deleteSelectedRecords() {
    var arr = [...this.companyArr.filter(x => x.isSelected == true)];
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${arr.length} Companies`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        arr.forEach((item, index) => {
          this._CompanyService.delete(item.id).pipe(takeUntil(this.destroyNotify)).subscribe(model => {
            if (index == (arr.length - 1)) {
              this._ToastrManager.successToastr(`${arr.length} record has been deleted successfully`);
              this.getData();
            }
          });
        });
      }
    });
  }

  delete(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to delete Company',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._CompanyService.delete(id).pipe(takeUntil(this.destroyNotify)).subscribe(model => {
          this._ToastrManager.successToastr("record has been deleted successfully");
          this.getData();
        });
      }
    });
  }

  onChangeSelectAll(isSelect: boolean) {
    this.companyArr.forEach(x => x.isSelected = isSelect);
  }

  showAddCompanyPopup(id = null) {
    this.addCompanyPopup.showPopup(id);
    this.addCompanyPopup.emitter.subscribe(companyId => {
      this.getData();
    })
  }

  private getData() {
    const formValue = this.rForm.value;
    var filter: CompaniesArrFilter = {
      name: formValue.name,
      isPrimary: formValue.isPrimary,
      skip:formValue.skip,
      take:formValue.take,
      orderBy: formValue.orderBy
    };
    this._CompanyService.getArr(filter).subscribe(arr => {
      this.companyArr = arr;
    }, err => {       console.log(err);
    }, () => {
      setTimeout(() => {
        $(".document-name").unmark();
        if (formValue.name != null) {
          $(".document-name").mark(formValue.name);
        }
      }, 1000);
    });
  }
}
