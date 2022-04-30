import { SelectCompanyInputComponent } from './../../../shared/components/select-company-input/select-company-input.component';
import { AddCompanyPopupComponent } from './../add-company-popup/add-company-popup.component';
import { AnalyticsFileModel } from './../../../shared/models/analytics-file.model';
import { forkJoin, Observable } from 'rxjs';
import { AnalyticsTypeService } from './../../../shared/services/analytics-type.service';
import { AnalyticsService } from './../../../shared/services/analytics.service';
import { AnalyticsTypeDto } from './../../../shared/dtos/analytics-type.dto';
import { CompanyDto } from './../../../shared/dtos/company.dto';
import { AddAnalyticsPopupFormInterface } from './../../../shared/form-interfaces/add-analytics-popup.form-interface';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@ng-stack/forms';
import { AnalyticsModel } from 'src/app/shared/models/analytics.model';
import { CompanyService } from 'src/app/shared/services/company.service';
import { Options } from '@angular-slider/ngx-slider';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { AngularMyDatePickerOptions } from 'src/app/shared/settings/angular-mydatepicker-options';
import { ToastrManager } from 'ng6-toastr-notifications';
import moment from 'moment';
import { AnalyticsFileDto } from 'src/app/shared/dtos/analytics-file.dto';
import { AnalyticsFileService } from 'src/app/shared/services/analytics-file.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import Swal from 'sweetalert2'
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-add-analytics-popup',
  templateUrl: './add-analytics-popup.component.html',
  styleUrls: ['./add-analytics-popup.component.scss']
})
export class AddAnalyticsPopupComponent implements OnInit {

  title;
  isEditMode: boolean;
  rForm: FormGroup<AddAnalyticsPopupFormInterface>;
  ratingCtrl = new FormControl();
  analyticsModel: AnalyticsModel = null;
  primaryCompanyArr: CompanyDto[];
  secondaryCompanyArr: CompanyDto[];
  analyticsTypeArr: AnalyticsTypeDto[];
  saveBtnClicked: boolean = false;
  analyticsFileArr: AnalyticsFileModel[];
  analyticsFileArrConst: AnalyticsFileModel[];

  myOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'mm/dd/yyyy',
  };

  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() emitter = new EventEmitter<string>();

  @ViewChild("nForm", { static: false }) nForm: NgForm;
  @ViewChild("addAnalyticsModel", { static: false }) modal: NgxSmartModalComponent;
  @ViewChild('ratingInput') input: ElementRef;
  @ViewChild('addCompanyPopup', { static: false }) addCompanyPopup: AddCompanyPopupComponent;
  @ViewChild('selectCompanyInputForPrimary', { static: false }) selectCompanyInputForPrimary: SelectCompanyInputComponent;
  @ViewChild('selectCompanyInputForSecondary', { static: false }) selectCompanyInputForSecondary: SelectCompanyInputComponent;

  constructor(private _FormBuilder: FormBuilder, private _AnalyticsService: AnalyticsService,
    private _CompanyService: CompanyService, private _AnalyticsTypeService: AnalyticsTypeService,
    private _AngularMyDatePickerOptions: AngularMyDatePickerOptions, private _ToastrManager: ToastrManager,
    private _AnalyticsFileService: AnalyticsFileService, private _StorageService: StorageService) { }

  ngOnInit(): void {
    this.rForm = this._FormBuilder.group<AddAnalyticsPopupFormInterface>({
      id: [null],
      documentName: [null, [Validators.required]],
      primaryCompanyIdArr: [null],
      secondaryCompanyIdArr: [null],
      analyticsTypeId: [null, [Validators.required]],
      expertCount: [null, [Validators.required, Validators.min(0)]],
      length: [null, [Validators.required, Validators.min(0)]],
      flag: [0],
      description: [null],
      analyst: [null],
      reportDate: [null, [Validators.required]]
    });
  }

  showPopup(id = null) {
    this.clearData();
    this.title = id == null ? 'Add Analytics Document' : 'Edit Analytics Document';
    this.isEditMode = id == null ? false : true;
    this.getData(id);
    this.modal.open();
  }

  showAddCompanyPopup(isPrimary: boolean) {
    if (isPrimary == true) {
      this.addCompanyPopup.showPopupForPrimary();
    } else {
      this.addCompanyPopup.showPopupForSecondary();
    }

    this.addCompanyPopup.emitter.pipe(take(1)).subscribe(companyId => {
      if (isPrimary == true) {
        this._CompanyService.getAll(true).subscribe(arr => {
          this.primaryCompanyArr = arr;
          var primaryCompanyIdArr = this.rForm.value.primaryCompanyIdArr || [];
          (primaryCompanyIdArr as any[]).push(companyId);
          this.rForm.controls.primaryCompanyIdArr.setValue(primaryCompanyIdArr);
        });
      } else {
        this._CompanyService.getAll(false).subscribe(arr => {
          this.secondaryCompanyArr = arr;
          var secondaryCompanyIdArr = this.rForm.value.secondaryCompanyIdArr || [];
          (secondaryCompanyIdArr as any[]).push(companyId);
          this.rForm.controls.secondaryCompanyIdArr.setValue(secondaryCompanyIdArr);
        });
      }
    })
  }

  save(isClose: boolean = true) {
    if (this.saveBtnClicked == true) {
      return false;
    } else {
      this.nForm.onSubmit(undefined);
      if (!this.rForm.invalid) {
        this.saveBtnClicked = true;
        if (this.isEditMode == false) {
          this.saveCreate(isClose);
        } else {
          this.saveUpdate(isClose);
        }
      }
    }
  }

  upload(files: File[]) {
    if (files.length == 0) {
      this._ToastrManager.warningToastr('No file selected for upload');
      return false
    }

    for (let index = 0; index < files.length; index++) {
      var file = files[index];
      var model: AnalyticsFileModel = {
        id: null,
        name: file.name,
        url: null,
        analyticsId: null,
        createdDate: Date.now(),
        file: file
      };

      this.analyticsFileArr.push(model);

      if (index == files.length - 1) {
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  deleteFile(index) {
    this.analyticsFileArr.splice(index, 1);
  }

  delete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to delete analyst',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        const formValue = this.rForm.getRawValue();
        this._AnalyticsService.delete(formValue.id).subscribe(model => {
          var oldUploadedFiles = this.analyticsFileArr.filter(x => x.id != null);

          if (oldUploadedFiles.length) {
            oldUploadedFiles.forEach((file, index) => {
              this._AnalyticsFileService.delete(file.id).subscribe(() => {
                this._StorageService.delete(file.url).then(() => {
                  if (index == oldUploadedFiles.length - 1) {
                    this.emitter.emit();
                    this.modal.close();
                    this._ToastrManager.successToastr("record has been deleted successfully");
                  }
                });
              });
            })
          } else {
            this.emitter.emit();
            this.modal.close();
            this._ToastrManager.successToastr("record has been deleted successfully");
          }
        });
      }
    });
  }

  private getData(id = null) {
    this._AnalyticsTypeService.getAll().subscribe(arr => {
      this.analyticsTypeArr = arr;
    });

    if (id != null) {
      this._AnalyticsService.get(id).subscribe(result => {
        this.analyticsModel = result;
        this.rForm.patchValue({
          id: result.id,
          documentName: result.documentName,
          primaryCompanyIdArr: result.primaryCompanyIdArr,
          secondaryCompanyIdArr: result.secondaryCompanyIdArr,
          analyticsTypeId: result.analyticsTypeId,
          expertCount: result.expertCount,
          length: result.length,
          flag: result.flag,
          description: result.description,
          analyst: result.analyst,
          reportDate: this._AngularMyDatePickerOptions.FormatDateToNgxDate(result.reportDate)
        });

        this.ratingCtrl.patchValue(result.rating);
      })

      this.getAnalyticsFileData(id);
    }
  }

  private fillModel() {
    var primaryCompanyIdArr = this.selectCompanyInputForPrimary.getSelectedCompanyIdArr();
    var secondaryCompanyIdArr = this.selectCompanyInputForSecondary.getSelectedCompanyIdArr();

    const formValue = this.rForm.getRawValue();
    var model: AnalyticsModel = {
      id: formValue.id,
      flag: formValue.flag || 0,
      primaryCompanyIdArr: primaryCompanyIdArr == [] ? null : primaryCompanyIdArr,
      secondaryCompanyIdArr: secondaryCompanyIdArr == [] ? null : secondaryCompanyIdArr,
      documentName: formValue.documentName,
      expertCount: formValue.expertCount,
      length: formValue.length,
      analyticsTypeId: formValue.analyticsTypeId,
      analyst: formValue.analyst,
      description: formValue.description,
      reportDate: moment(formValue.reportDate.singleDate.formatted).valueOf(),
      rating: this.ratingCtrl.value,
      promote: (this.analyticsModel != null ? this.analyticsModel.promote : false) || false,
      publish: (this.analyticsModel != null ? this.analyticsModel.publish : false) || false,
      date: Date.now(),
      updatedDate: Date.now()
    };
    return model;
  }

  private clearData() {
    this.rForm.reset();
    this.nForm.reset();

    this.analyticsModel = null;
    this.primaryCompanyArr = [];
    this.secondaryCompanyArr = [];
    this.analyticsTypeArr = [];
    this.analyticsFileArr = [];

    this.ratingCtrl.setValue(5);
    this.saveBtnClicked = false;

    this.selectCompanyInputForPrimary.clearData();
    this.selectCompanyInputForSecondary.clearData();
  }

  private getAnalyticsFileData(analyticsId) {
    this._AnalyticsFileService.getArr(analyticsId).subscribe(arr => {
      this.analyticsFileArr = arr;
      this.analyticsFileArrConst = [...arr];
    })
  }

  private saveCreate(isClose: boolean) {
    var model = this.fillModel();
    this._AnalyticsService.create(model).subscribe((analyticsId) => {
      var newUploadedFiles = this.analyticsFileArr.filter(x => x.id == null);

      if (newUploadedFiles.length > 0) {

        newUploadedFiles.forEach((newFileModel, i) => {
          newFileModel.analyticsId = analyticsId;
          this._StorageService.upload(newFileModel.file, `analytics/${analyticsId}/${newFileModel.name}`).subscribe(url => {
            newFileModel.url = url;
            this._AnalyticsFileService.create(newFileModel).subscribe(model => {
              if (i == newUploadedFiles.length - 1) {
                this._ToastrManager.successToastr("Report has been created successfully");

                if (isClose == true) {
                  this.modal.close();
                } else {
                  this.isEditMode = true;
                  this.saveBtnClicked = false;
                  this.getData(analyticsId);
                }
              }
            });
          });
        });

      } else {
        this._ToastrManager.successToastr("Report has been created successfully");

        if (isClose == true) {
          this.modal.close();
        } else {
          this.isEditMode = true;
          this.saveBtnClicked = false;
          this.getData(analyticsId);
        }
      }

      this.emitter.emit(analyticsId);

    }, err => {
      this.saveBtnClicked = false;
    });
  }

  private saveUpdate(isClose: boolean) {
    var observArr = [];

    var model = this.fillModel();
    this._AnalyticsService.update(model).subscribe((analyticsId) => {
      var newUploadedFiles = this.analyticsFileArr.filter(x => x.id == null);

      if (newUploadedFiles.length > 0) {
        newUploadedFiles.forEach((newFileModel, i) => {
          newFileModel.analyticsId = analyticsId;
          var observ = this._StorageService.upload(newFileModel.file, `analytics/${analyticsId}/${newFileModel.name}`).pipe((map(url => {
            newFileModel.url = url;
            this._AnalyticsFileService.create(newFileModel).subscribe(model => {
            });
          })));

          observArr.push(observ);
        });
      }

      var deletedFileArr = [];
      if (this.analyticsFileArrConst != undefined) {
        this.analyticsFileArrConst.forEach(item => {
          var isDeleted = this.analyticsFileArr.findIndex(x => x.id == item.id) == -1;
          if (isDeleted == true) {
            deletedFileArr.push(item);
          }
        })
      }

      if (deletedFileArr.length > 0) {
        deletedFileArr.forEach(file => {
          var observ = this._AnalyticsFileService.delete(file.id).pipe(map(() => {
            this._StorageService.delete(file.url).then(() => { });
          }));
          observArr.push(observ);
        });
      }

      if (observArr.length > 0) {
        forkJoin(observArr).subscribe(() => {
          this._ToastrManager.successToastr("Report has been updated successfully");

          if (isClose == true) {
            this.modal.close();
          } else {
            this.isEditMode = true;
            this.saveBtnClicked = false;
            this.getData(analyticsId);
          }
          this.emitter.emit();
        });
      }
      else {
        this._ToastrManager.successToastr("Report has been updated successfully");

        if (isClose == true) {
          this.modal.close();
        } else {
          this.isEditMode = true;
          this.saveBtnClicked = false;
          this.getData(analyticsId);
        }
        this.emitter.emit();
      }

    }, err => {
      this.saveBtnClicked = false;
    });
  }

}
