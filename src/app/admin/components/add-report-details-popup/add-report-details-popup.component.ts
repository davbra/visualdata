import { ActivatedRoute } from '@angular/router';
import { NestedTransferModel } from './../../../shared/models/nested-transfer-model';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AnalyticsDetailModel } from './../../../shared/models/analytics-detail.model';
import { AnalyticsDetailService } from './../../../shared/services/analytics-detail.service';
import { AnalyticsDto } from './../../../shared/dtos/analytics.dto';
import { AddReportDetailsPopupFormInterface } from './../../../shared/form-interfaces/add-report-details-popup.form-interface';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@ng-stack/forms';
import { NgForm, Validators } from '@angular/forms';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
declare var $: any;

@Component({
  selector: 'app-add-report-details-popup',
  templateUrl: './add-report-details-popup.component.html',
  styleUrls: ['./add-report-details-popup.component.scss']
})
export class AddReportDetailsPopupComponent implements OnInit {

  title;
  isEditMode: boolean;
  showEditor: boolean = false;
  saveBtnClicked: boolean = false;
  analyticsItem: AnalyticsDto;
  rForm: FormGroup<AddReportDetailsPopupFormInterface>;

  ckEditorConfig = {
    extraPlugins: 'divarea',
    removeButtons: 'Styles,Format,Font,FontSize,About,Blockquote,Bold,Italic,Underline,Strike,Subscript,Superscript,-,CopyFormatting,RemoveFormat,Image,Flash,Table,HorizontalRule'
  };

  @Output() emitter = new EventEmitter<NestedTransferModel<AnalyticsDetailModel>>();

  @ViewChild("nForm", { static: false }) nForm: NgForm;
  @ViewChild("addReportDetailsModal", { static: false }) modal: NgxSmartModalComponent;

  constructor(private _FormBuilder: FormBuilder, private _AnalyticsDetailService: AnalyticsDetailService,
    private _ToastrManager: ToastrManager) { }

  ngOnInit(): void {
    this.rForm = this._FormBuilder.group<AddReportDetailsPopupFormInterface>({
      id: [null],
      topicName: [null, [Validators.required]],
      htmlDetails: [null]
    });
  }

  showPopup(analyticsItem: AnalyticsDto, id = null) {
    this.clearData();
    this.analyticsItem = analyticsItem;
    this.title = id == null ? 'Add Report Details' : 'Edit Report Details';
    this.isEditMode = id == null ? false : true;

    setTimeout(() => {
      this.rForm.setValue({
        id: null,
        topicName: null,
        htmlDetails: null
      });
      this.showEditor = true;
    });

    if (id != null) {
      this.getData(id)
    }

    this.modal.open();
  }

  onReady() {
    console.log('ready');
    setTimeout(() => {
      $('.cke_toolbar_break').remove();
    });
  }

  save() {
    this.saveBtnClicked = true;
    const formValue = this.rForm.value;
    if (formValue.htmlDetails == null || formValue.htmlDetails == '') {
      this._ToastrManager.warningToastr('editor is empty');
      this.saveBtnClicked = false;
      return false;
    }


    var model: AnalyticsDetailModel = {
      id: formValue.id,
      topic: formValue.topicName,
      htmlDetails: formValue.htmlDetails,
      analyticsId: this.analyticsItem.id,
      createdDate: Date.now()
    };
    if (this.isEditMode == false) {
      this._AnalyticsDetailService.create(model).subscribe(id => {
        model.id = id;
        var transModel: NestedTransferModel<AnalyticsDetailModel> = {
          isNew: true,
          data: model
        };

        this.emitter.emit(transModel);
        this.modal.close();
      }, err => {
        this.saveBtnClicked = false;
      })
    } else {
      this._AnalyticsDetailService.update(model).subscribe(result => {
        var transModel: NestedTransferModel<AnalyticsDetailModel> = {
          isNew: false,
          data: model
        };

        this.emitter.emit(transModel);
        this.modal.close();
      }, err => {
        this.saveBtnClicked = false;
      })
    }
  }

  private getData(id) {
    this._AnalyticsDetailService.get(id).subscribe(result => {
      this.rForm.patchValue({
        id: result.id,
        topicName: result.topic,
        htmlDetails: result.htmlDetails
      });
    })
  }

  private clearData() {
    this.rForm.reset();
    this.nForm.reset();

    this.showEditor = false;
    this.saveBtnClicked = false;
  }

}
