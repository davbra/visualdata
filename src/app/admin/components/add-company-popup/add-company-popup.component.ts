import { CompanyModel } from './../../../shared/models/company.model';
import { Observable } from 'rxjs';
import { CompanyService } from './../../../shared/services/company.service';
import { NgForm, Validators } from '@angular/forms';
import { AddCompanyPopupFormInterface } from './../../../shared/form-interfaces/add-company-popup.form-interface';
import { FormGroup, FormBuilder } from '@ng-stack/forms';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-company-popup',
  templateUrl: './add-company-popup.component.html',
  styleUrls: ['./add-company-popup.component.scss']
})
export class AddCompanyPopupComponent implements OnInit {

  title;
  saveBtnClicked = false;
  isEditMode = false;
  hideIsPrimaryCtrl = false;
  rForm: FormGroup<AddCompanyPopupFormInterface>;

  @Output() emitter = new EventEmitter<string>();

  @ViewChild("nForm", { static: false }) nForm: NgForm;
  @ViewChild("addCompanyModal", { static: false }) modal: NgxSmartModalComponent;

  constructor(private _FormBuilder: FormBuilder, private _CompanyService: CompanyService,
    private _ToastrManager: ToastrManager) { }

  ngOnInit(): void {
    this.rForm = this._FormBuilder.group<AddCompanyPopupFormInterface>({
      id: [null],
      name: [null, [Validators.required]],
      tickerName: [null, [Validators.required]],
      isPrimary: [null, [Validators.required]]
    });
  }

  showPopup(id = null) {
    this.clearData();
    this.title = id == null ? 'Add Company' : 'Edit Company';
    this.isEditMode = id == null ? false : true;
    this.getData(id);
    this.modal.open();
  }

  showPopupForPrimary(id = null) {
    this.clearData();
    this.title = id == null ? 'Add Primary Company' : 'Edit Primary Company';
    this.isEditMode = id == null ? false : true;
    this.rForm.controls.isPrimary.setValue(true);
    this.hideIsPrimaryCtrl = true;
    this.getData(id);
    this.modal.open();
  }

  showPopupForSecondary(id = null) {
    this.clearData();
    this.title = id == null ? 'Add Secondary Company' : 'Edit Secondary Company';
    this.isEditMode = id == null ? false : true;
    this.rForm.controls.isPrimary.setValue(false);
    this.hideIsPrimaryCtrl = true;
    this.getData(id);
    this.modal.open();
  }

  save() {
    const formValue = this.rForm.getRawValue();
    var model: CompanyModel = {
      id: formValue.id,
      name: formValue.name,
      tickerName:formValue.tickerName,
      isPrimary: formValue.isPrimary
    }

    var observ: Observable<any>;
    if (this.isEditMode == false) {
      observ = this._CompanyService.create(model);
    } else {
      observ = this._CompanyService.update(model);
    }

    observ.subscribe(id => {
      if (this.isEditMode == false) {
        this._ToastrManager.successToastr("Company has been created successfully");
      } else {
        this._ToastrManager.successToastr("Company has been updated successfully");
      }
      this.emitter.emit(id);
      this.modal.close();
    })
  }

  private getData(id = null) {
    if (id != null) {
      this._CompanyService.get(id).subscribe(result => {
        this.rForm.patchValue({
          id: result.id,
          name: result.name,
          isPrimary: result.isPrimary
        });
        this.rForm.controls.isPrimary.disable();
      });
    }
  }

  private clearData() {
    this.rForm.reset();
    this.nForm.reset();

    this.saveBtnClicked = false;
    this.hideIsPrimaryCtrl = false;

    this.rForm.controls.isPrimary.enable();
  }

}
