import { AnalyticsDetailService } from './analytics-detail.service';
import { AnalyticsArrFilter } from './../filters/analytics-arr.filter';
import { AnalyticsModel } from './../models/analytics.model';
import { AnalyticsDto } from './../dtos/analytics.dto';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { debounceTime, map, take } from 'rxjs/operators';
import analyticsArr from '../../../assets/data/analytics-arr.json';
import { defer, Observable } from 'rxjs';
import { CompanyService } from './company.service';
import { AnalyticsTypeService } from './analytics-type.service';
import Enumerable from 'node-enumerable';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private collectionName = 'analytics';

  constructor(private _AngularFirestore: AngularFirestore, private _CompanyService: CompanyService,
    private _AnalyticsTypeService: AnalyticsTypeService, private _HttpClient: HttpClient,
    private _AnalyticsDetailService: AnalyticsDetailService) { }

  get(id): Observable<AnalyticsModel> {
    return this._AngularFirestore.doc(`${this.collectionName}/${id}`).snapshotChanges().pipe(take(1)).pipe(map(x => {
      return {
        id: x.payload.id,
        ...x.payload.data() as any
      } as AnalyticsModel;
    }));
  }


  getDto(id): Observable<AnalyticsDto> {
    return this._AngularFirestore.doc(`${this.collectionName}/${id}`).snapshotChanges().pipe(take(1)).pipe(map(x => {
      return {
        id: x.payload.id,
        ...x.payload.data() as any
      } as AnalyticsModel;
    })).pipe(map((item => {

      var dto: AnalyticsDto = {
        id: item.id,
        flag: item.flag,
        date: item.date,
        updatedDate: item.updatedDate,
        primaryCompanyArr: [],
        secondaryCompanyArr: [],
        documentName: item.documentName,
        expertCount: item.expertCount,
        length: item.length,
        analyticsType: null,
        publish: item.publish,
        promote: item.promote,
        analyst: item.analyst,
        reportDate: item.reportDate,
        description: item.description,
        analyticsDetailArr: []
      }

      if (item.primaryCompanyIdArr.length > 0) {
        dto.primaryCompanyArr = [];
        item.primaryCompanyIdArr.forEach(companyId => {
          this._CompanyService.allCustomerArrObserv.pipe(take(1)).subscribe(arr => {
            var company = arr.find(x => x.id == companyId);
            dto.primaryCompanyArr.push(company);
          })
        })
      }

      if (item.secondaryCompanyIdArr?.length > 0) {
        dto.secondaryCompanyArr = [];
        item.secondaryCompanyIdArr.forEach(companyId => {
          this._CompanyService.allCustomerArrObserv.pipe(take(1)).subscribe(arr => {
            var company = arr.find(x => x.id == companyId);
            dto.secondaryCompanyArr.push(company);
          })
        })
      }

      if (item.analyticsTypeId != null) {
        this._AnalyticsTypeService.allAnalyticsTypeArrObserv.subscribe(arr => {
          dto.analyticsType = arr.find(x => x.id == item.analyticsTypeId);
        })
      }

      return dto;
    })))
  }

  count() {
    this.updateReportDate();
    return this._AngularFirestore.collection(this.collectionName).get().pipe(take(1)).toPromise().then((querySnapshot) => {
      return querySnapshot.docs.length;
    });
  }

  getArr(filter: AnalyticsArrFilter): Observable<AnalyticsDto[]> {
    return this._AngularFirestore.collection(this.collectionName, ref => {
      if (filter.orderBy == null) {
        return ref.orderBy('reportDate', 'desc').orderBy('documentName', 'asc');
      }
      else {
        var values = (filter.orderBy as string).split('-');

        if (values[1] == '') {
          return ref.orderBy('reportDate', 'desc').orderBy('documentName', 'asc');
        } else {
          return ref.orderBy(values[0], values[1] as any);
        }
      }
    })
      .get().pipe(take(1)).pipe(map(x => {
        return x.docs.map(e => {
          return {
            id: e.id,
            ...e.data() as any
          } as AnalyticsModel;
        })
      })).pipe(map((arr => {
        var dtoArr: AnalyticsDto[] = [];
        arr.forEach(item => {
          var dto: AnalyticsDto = {
            id: item.id,
            flag: item.flag,
            date: item.date,
            updatedDate: item.updatedDate,
            primaryCompanyArr: [],
            secondaryCompanyArr: [],
            documentName: item.documentName,
            expertCount: item.expertCount,
            length: item.length,
            analyticsType: null,
            publish: item.publish,
            promote: item.promote,
            analyst: item.analyst,
            reportDate: item.reportDate,
            description: item.description,
            analyticsDetailArr: []
          }

          if (item.primaryCompanyIdArr.length > 0) {
            dto.primaryCompanyArr = [];
            item.primaryCompanyIdArr.forEach(companyId => {
              this._CompanyService.allCustomerArrObserv.pipe(take(1)).subscribe(arr => {
                var company = arr.find(x => x.id == companyId);
                dto.primaryCompanyArr.push(company);
              })
            })
          }

          if (item.secondaryCompanyIdArr?.length > 0) {
            dto.secondaryCompanyArr = [];
            item.secondaryCompanyIdArr.forEach(companyId => {
              this._CompanyService.allCustomerArrObserv.pipe(take(1)).subscribe(arr => {
                var company = arr.find(x => x.id == companyId);
                dto.secondaryCompanyArr.push(company);
              })
            })
          }

          if (item.analyticsTypeId != null) {
            this._AnalyticsTypeService.allAnalyticsTypeArrObserv.subscribe(arr => {
              dto.analyticsType = arr.find(x => x.id == item.analyticsTypeId);
            })
          }

          dtoArr.push(dto);
        });

        return dtoArr;
      }))).pipe(debounceTime(50)).pipe(map(arr => {
        var filterList: AnalyticsDto[] = arr;

        if (filter.companyId != null) {
          filterList = filterList.filter(x => x.primaryCompanyArr.filter(c => c.id.indexOf(filter.companyId) > -1).length > 0 ||
            x.secondaryCompanyArr.filter(c => c.id.indexOf(filter.companyId) > -1).length > 0);
        }

        if (filter.documentName != null) {
          filterList = filterList.filter(x => x.documentName.toLowerCase().indexOf(filter.documentName.toLowerCase()) > -1 ||
            x.analyticsType?.name.toLowerCase().indexOf(filter.documentName.toLowerCase()) > -1);
        }

        if (filter.analyticsTypeId != null) {
          filterList = filterList.filter(x => x.analyticsType.id == filter.analyticsTypeId);
        }

        if (filter.isPublish != null) {
          filterList = filterList.filter(x => x.publish == filter.isPublish);
        }

        if (filter.isPromote != null) {
          filterList = filterList.filter(x => x.promote == filter.isPromote);
        }

        if (filter.flag != null) {
          filterList = filterList.filter(x => x.flag == filter.flag)
        }

        if (filter.analyst != null) {
          filterList = filterList.filter(x => x.analyst != null).filter(x => x.analyst.toLowerCase().indexOf(filter.analyst.toLowerCase()) > -1)
        }

        var list = Enumerable.from(filterList);

        var count = list.length();
        if (filter.take) {
          list = list.skip(filter.skip).take(filter.take);
        }


        return list.toArray();
      }));
  }

  create(model: AnalyticsModel) {
    delete model.id
    return defer(() => {
      return this._AngularFirestore.collection(this.collectionName).add(model).then(result => {
        return result.id;
      })
    });
  }

  update(model: AnalyticsModel) {
    const id = model.id;
    delete model.id
    return defer(() => {
      return this._AngularFirestore.doc(`${this.collectionName}/${id}`).update(model).then(result => {
        return id;
      })
    });
  }

  delete(id) {
    return defer(() => {
      return this._AngularFirestore.doc(`${this.collectionName}/${id}`).delete().then(result => {
        return result;
      })
    });
  }

  updateReportDate() {
    this._AngularFirestore.collection(this.collectionName, ref => {
      return ref.orderBy('reportDate', 'desc').orderBy('documentName', 'asc');
    })
      .get().pipe(take(1)).pipe(map(x => {
        x.docs.map(e => {
          var model = {
            id: e.id,
            ...e.data() as any
          } as AnalyticsModel;

          model.reportDate = moment(model.reportDate).valueOf();
          this.update(model).subscribe();

          return {
            id: e.id,
            ...e.data() as any
          } as AnalyticsModel;
        })
      })).subscribe();
  }
}
