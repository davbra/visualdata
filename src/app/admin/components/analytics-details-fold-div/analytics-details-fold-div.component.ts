import { DownloadFileModel } from './../../../shared/models/download-file.model';
import { AnalyticsFileModel } from './../../../shared/models/analytics-file.model';
import { AnalyticsFileService } from './../../../shared/services/analytics-file.service';
import { AnalyticsFileDto } from './../../../shared/dtos/analytics-file.dto';
import { StorageService } from './../../../shared/services/storage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AnalyticsDto } from './../../../shared/dtos/analytics.dto';
import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { AnalyticsDetailService } from 'src/app/shared/services/analytics-detail.service';
import { take, takeUntil } from 'rxjs/operators';
import { AddReportDetailsPopupComponent } from '../add-report-details-popup/add-report-details-popup.component';
import { Subject } from 'rxjs';
import { AnalyticsService } from 'src/app/shared/services/analytics.service';
import { AnalyticsDetailDto } from 'src/app/shared/dtos/analytics-detail.dto';
import { AddAnalyticsDetailsDescriptionPopupComponent } from '../add-analytics-details-description-popup/add-analytics-details-description-popup.component';

@Component({
  selector: 'app-analytics-details-fold-div',
  templateUrl: './analytics-details-fold-div.component.html',
  styleUrls: ['./analytics-details-fold-div.component.scss']
})
export class AnalyticsDetailsFoldDivComponent implements OnInit {

  isEditMode: boolean = false;
  destroyNotify = new Subject();
  analyticsFileArr: AnalyticsFileDto[];

  @Input() analyticsDto: AnalyticsDto;
  @Input() viewOnly: boolean = true;

  @Output() onDuplicateEmit = new EventEmitter<AnalyticsDto>();

  @ViewChild('addReportDetailsPopup', { static: false }) addReportDetailsPopup: AddReportDetailsPopupComponent;
  @ViewChild('addAnalyticsDetailsDescriptionPopup', { static: false }) addAnalyticsDetailsDescriptionPopup: AddAnalyticsDetailsDescriptionPopupComponent;

  constructor(private _AnalyticsDetailService: AnalyticsDetailService, private _AnalyticsService: AnalyticsService,
    private _ToastrManager: ToastrManager, private _StorageService: StorageService,
    private _AnalyticsFileService: AnalyticsFileService) { }

  ngOnInit(): void {
    this.getData();
    this.getAnalyticsFileData();
  }

  showAddReportDetailsPopup(id = null) {
    this.addReportDetailsPopup.showPopup(this.analyticsDto, id);
    this.addReportDetailsPopup.emitter.pipe(take(1)).pipe(takeUntil(this.destroyNotify)).subscribe(transModel => {
      this.getData();
    })
  }

  upload(files: File[]) {
    if (files.length == 0) {
      this._ToastrManager.warningToastr('No file selected for upload');
      return false
    }
    let file: File = files[0];
    this._StorageService.upload(file, `analytics/${this.analyticsDto.id}/${file.name}`).subscribe(url => {

      var model: AnalyticsFileModel = {
        name: file.name,
        url: url,
        analyticsId: this.analyticsDto.id,
        createdDate: Date.now()
      };

      this._AnalyticsFileService.create(model).subscribe(model => {
        this._ToastrManager.successToastr('file has been uploaded successfully');
        this.getAnalyticsFileData();
      });
    });
  }

  duplicate(item) {
    this.onDuplicateEmit.emit(item);
  }

  onDownloadUrl(file: AnalyticsFileDto, isAll: boolean = false) {
    if (isAll == false) {
      this._AnalyticsFileService.downloadFile(file.name, file.url).subscribe();
    } else {
      var fileArr: DownloadFileModel[] = [];
      this.analyticsFileArr.forEach(item => {
        var model: DownloadFileModel = {
          name: item.name,
          url: item.url
        };
        fileArr.push(model);
      });
      this._AnalyticsFileService.downloadAllFile(fileArr, this.analyticsDto.documentName);
    }
  }

  deleteFile(file: AnalyticsFileDto) {
    this._AnalyticsFileService.delete(file.id).subscribe(() => {
      this._StorageService.delete(file.url).then(() => {
        this.getAnalyticsFileData();
        this._ToastrManager.successToastr('File has been deleted successfully');
      });
    })
  }


  onChangeEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  delete(item: AnalyticsDetailDto) {
    this._AnalyticsDetailService.delete(item.id).subscribe(() => {
      var index = this.analyticsDto.analyticsDetailArr.findIndex(x => x.id == item.id);
      this.analyticsDto.analyticsDetailArr.splice(index, 1);
      this._ToastrManager.successToastr('Question has been deleted successfully');
    })
  }

  showAddAnalyticsDetailsDescriptionPopup(){
    this.addAnalyticsDetailsDescriptionPopup.showPopup(this.analyticsDto);
    this.addAnalyticsDetailsDescriptionPopup.emitter.pipe(take(1)).subscribe(description=>{
      this.analyticsDto.description = description;
    })
  }

  private getData() {
    this._AnalyticsDetailService.getArr(this.analyticsDto.id).subscribe(arr => {
      this.analyticsDto.analyticsDetailArr = arr;
    })
  }

  private getAnalyticsFileData() {
    this._AnalyticsFileService.getArr(this.analyticsDto.id).subscribe(arr => {
      this.analyticsFileArr = arr;
    })
  }

}
