import { NgForm, Validators } from '@angular/forms';
import { AddAnalyticsDetailsDescriptionFormInterface } from './../../../shared/form-interfaces/add-analytics-details-description.form-interface';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@ng-stack/forms';
import { AnalyticsDto } from 'src/app/shared/dtos/analytics.dto';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { AnalyticsService } from 'src/app/shared/services/analytics.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-analytics-details-description-popup',
  templateUrl: './add-analytics-details-description-popup.component.html',
  styleUrls: ['./add-analytics-details-description-popup.component.scss']
})
export class AddAnalyticsDetailsDescriptionPopupComponent implements OnInit {

  title;
  isEditMode: boolean;
  saveBtnClicked: boolean = false;
  analyticsItem: AnalyticsDto;
  destroyNotify = new Subject();
  rForm: FormGroup<AddAnalyticsDetailsDescriptionFormInterface>;

  @Output() emitter = new EventEmitter<string>();

  @ViewChild("nForm", { static: false }) nForm: NgForm;
  @ViewChild("addAnalyticsDetailsDescriptionModal", { static: false }) modal: NgxSmartModalComponent;

  constructor(private _FormBuilder: FormBuilder, private _AnalyticsService: AnalyticsService,
    private _ToastrManager: ToastrManager) {
  }

  ngOnInit(): void {
    this.rForm = this._FormBuilder.group<AddAnalyticsDetailsDescriptionFormInterface>({
      analyticsId: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });
  }

  showPopup(analyticsItem: AnalyticsDto) {
    this.clearData();
    this.rForm.patchValue({
      analyticsId: analyticsItem.id,
      description: analyticsItem.description
    });
    this.analyticsItem = analyticsItem;
    this.modal.open();
  }

  save() {
    const formValue = this.rForm.value;
    this._AnalyticsService.get(formValue.analyticsId).pipe(takeUntil(this.destroyNotify)).subscribe(model => {
      model.description = formValue.description;
      this._AnalyticsService.update(model).pipe(takeUntil(this.destroyNotify)).subscribe(() => {
        this._ToastrManager.successToastr("Description has been updated successfully");
        this.emitter.emit(model.description);
        this.modal.close()
      });
    });
  }

  private clearData() {
    this.rForm.reset();
    this.nForm.reset();
  }

}
