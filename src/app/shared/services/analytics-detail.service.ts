import { AnalyticsDetailDto } from './../dtos/analytics-detail.dto';
import { AnalyticsDetailModel } from './../models/analytics-detail.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { defer, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsDetailService {

  private collectionName = 'analytics-detail';

  constructor(private _AngularFirestore: AngularFirestore) { }

  get(id): Observable<AnalyticsDetailModel> {
    return this._AngularFirestore.doc(`${this.collectionName}/${id}`).snapshotChanges().pipe(take(1)).pipe(map(x => {
      return {
        id: x.payload.id,
        ...x.payload.data() as any
      } as AnalyticsDetailModel;
    }));
  }

  getDto(id): Observable<AnalyticsDetailDto> {
    return this._AngularFirestore.doc(`${this.collectionName}/${id}`).snapshotChanges().pipe(take(1)).pipe(map(x => {
      return {
        id: x.payload.id,
        ...x.payload.data() as any
      } as AnalyticsDetailModel;
    })).pipe(map((item => {
      var dto: AnalyticsDetailDto = {
        id: item.id,
        htmlDetails: item.htmlDetails,
        topic: item.topic,
        analyticsId: item.analyticsId,
        createdDate: item.createdDate
      }
      return dto;
    })));;
  }

  getArr(reportId): Observable<AnalyticsDetailDto[]> {
    return this._AngularFirestore.collection(this.collectionName, ref => {
      return ref.where('analyticsId', '==', reportId).orderBy('createdDate');
    }).get().pipe(take(1)).pipe(map(x => {
      return x.docs.map(e => {
        return {
          id: e.id,
          ...e.data() as any
        } as AnalyticsDetailModel;
      })
    })).pipe(map((arr => {
      var dtoArr: AnalyticsDetailDto[] = [];
      arr.forEach(item => {
        var dto: AnalyticsDetailDto = {
          id: item.id,
          htmlDetails: item.htmlDetails,
          topic: item.topic,
          analyticsId: item.analyticsId,
          createdDate: item.createdDate
        }
        dtoArr.push(dto);
      });
      return dtoArr;
    })));
  }

  create(model: AnalyticsDetailModel): Observable<string> {
    delete model.id
    return defer(() => {
      return this._AngularFirestore.collection(this.collectionName).add(model).then(result => {
        return result.id;
      })
    });
  }

  update(model: AnalyticsDetailModel) {
    const id = model.id;
    delete model.id
    return defer(() => {
      return this._AngularFirestore.doc(`${this.collectionName}/${id}`).update(model).then(result => {
        return result;
      })
    });
  }

  delete(id) {
    return defer(() => {
      return this._AngularFirestore.doc(`${this.collectionName}/${id}`).delete().then(result => {
        console.log(result);
        return result;
      })
    });
  }
}
