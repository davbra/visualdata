import { AnalyticsTypeModel } from './../models/analytics-type.model';
import { AnalyticsTypeDto } from './../dtos/analytics-type.dto';
import { AnalyticsDto } from './../dtos/analytics.dto';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import analyticsArr from '../../../assets/data/analytics-type-arr.json';
import { map, take } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsTypeService {

  private collectionName = 'analyticTypes';
  private allAnalyticsTypeSubject: BehaviorSubject<AnalyticsTypeDto[]> = new BehaviorSubject(null);

  get allAnalyticsTypeArrObserv(): Observable<AnalyticsTypeDto[]> {
    return this.allAnalyticsTypeSubject.asObservable();
  }

  constructor(private _AngularFirestore: AngularFirestore) { 
    this.getAll().subscribe(arr=>{
      this.allAnalyticsTypeSubject.next(arr);
    })
  }

  getAnalyticsTypeDto(id): Observable<AnalyticsTypeDto> {
    return this._AngularFirestore.doc(`${this.collectionName}/${id}`).snapshotChanges().pipe(take(1)).pipe(map(x => {
      return {
        id: x.payload.id,
        ...x.payload.data() as any
      } as AnalyticsTypeModel;
    })).pipe(map((item => {
      var dto: AnalyticsTypeDto = {
        id: item.id,
        name: item.name,
        type:item.type
      }
      return dto;
    })));
  }

  getAll(): Observable<AnalyticsTypeDto[]> {
    return this._AngularFirestore.collection(this.collectionName).get().pipe(take(1)).pipe(map(x => {
      return x.docs.map(e => {
        return {
          id: e.id,
          ...e.data() as any
        } as AnalyticsTypeModel;
      })
    })).pipe(map((arr => {
      return arr.map(item => {
        var dto: AnalyticsTypeDto = {
          id: item.id,
          name: item.name ,
          type : item.type
        }
        return dto;
      });
    })));
  }

  initialRecords() {
    this._AngularFirestore.collection(this.collectionName).get().toPromise().then((querySnapshot) => {
      if (querySnapshot.docs.length == 0) {
        var arr = analyticsArr as AnalyticsTypeDto[];
        arr.forEach(model => {
          delete model.id
          this._AngularFirestore.collection(this.collectionName).add(model).then(result => {
            return result;
          });
        });
      }
    });
  }
}
