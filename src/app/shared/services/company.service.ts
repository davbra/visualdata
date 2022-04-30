import { CompaniesArrFilter } from './../filters/companies-arr.filter';
import { CompanyDto } from './../dtos/company.dto';
import { CompanyModel } from './../models/company.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import companyArr from '../../../assets/data/company-arr.json';
import { defer, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import Enumerable from 'node-enumerable';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private collectionName = 'companies';
  private allCustomerArrSubject: BehaviorSubject<CompanyDto[]> = new BehaviorSubject(null);


  get allCustomerArrObserv(): Observable<CompanyDto[]> {
    return this.allCustomerArrSubject.asObservable();
  }

  constructor(private _AngularFirestore: AngularFirestore) {
    this.reloadCompanyArr();
  }

  get(id): Observable<CompanyModel> {
    return this._AngularFirestore.doc(`${this.collectionName}/${id}`).snapshotChanges().pipe(take(1)).pipe(map(x => {
      return {
        id: x.payload.id,
        ...x.payload.data() as any
      } as CompanyModel;
    }))
  }

  getAll(isPrimary: boolean = null): Observable<CompanyDto[]> {
    return this._AngularFirestore.collection(this.collectionName, ref => {
      if (isPrimary != null) {
        return ref.where('isPrimary', '==', isPrimary).orderBy('name', 'asc');
      } else {
        return ref.orderBy('name', 'asc');
      }
    }).get().pipe(take(1)).pipe(map(x => {
      return x.docs.map(e => {
        return {
          id: e.id,
          ...e.data() as any
        } as CompanyModel;
      })
    })).pipe(map((arr => {
      return arr.map(item => {
        var dto: CompanyDto = {
          id: item.id,
          name: item.name,
          tickerName: item.tickerName,
          isPrimary: item.isPrimary
        }
        return dto;
      });
    })));
  }

  search(text: string, isPrimary: boolean, excludeCompanyIdArr: any[]) {
    return this.allCustomerArrSubject.pipe(map((companyArr: CompanyDto[]) => {
      var arr: CompanyDto[] = companyArr;
      if (isPrimary != null) {
        arr = arr.filter(x => x.isPrimary == isPrimary);
      }

      if (excludeCompanyIdArr.length > 0) {
        arr = arr.filter(x => excludeCompanyIdArr.indexOf(x.id) == -1);
      }

      if (text != '' && text != null) {
        arr = arr.filter(x => x.name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) > -1);
      } else {
        arr = [];
      }
      return [...arr];
    }));
  }

  getArr(filter: CompaniesArrFilter): Observable<CompanyDto[]> {
    return this._AngularFirestore.collection(this.collectionName, ref => {
      let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;

      if (filter.isPrimary != null) {
        query = query.where('isPrimary', '==', filter.isPrimary)
      }

      if (filter.orderBy == null) {
        query = query.orderBy('name', 'asc');
      }
      else {
        var values = (filter.orderBy as string).split('-');

        if (values[1] == '') {
          query = query.orderBy('name', 'asc');
        } else {
          query = query.orderBy(values[0], values[1] as any);
        }
      }

      return query;
    }).get().pipe(take(1)).pipe(map(x => {
      return x.docs.map(e => {
        return {
          id: e.id,
          ...e.data() as any
        } as CompanyModel;
      })
    })).pipe(map((arr => {
      return arr.map(item => {
        var dto: CompanyDto = {
          id: item.id,
          name: item.name,
          tickerName: item.tickerName,
          isPrimary: item.isPrimary
        }
        return dto;
      });
    }))).pipe(map((arr => {
      var filterList: CompanyDto[] = arr;

      if (filter.name != null) {
        filterList = filterList.filter(x => x.name.toLowerCase().indexOf(filter.name.toLowerCase()) > -1);
      }

      var list = Enumerable.from(filterList);

      if (filter.take) {
        list = list.skip(filter.skip).take(filter.take);
      }

      return list.toArray();
    })));
  }

  create(model: CompanyModel) {
    delete model.id
    return defer(() => {
      return this._AngularFirestore.collection(this.collectionName).add(model).then(result => {
        this.reloadCompanyArr();
        return result.id;
      })
    });
  }

  update(model: CompanyModel) {
    const id = model.id;
    delete model.id
    return defer(() => {
      return this._AngularFirestore.doc(`${this.collectionName}/${id}`).update(model).then(result => {
        this.reloadCompanyArr();
        return id;
      })
    });
  }

  delete(id) {
    return defer(() => {
      return this._AngularFirestore.doc(`${this.collectionName}/${id}`).delete().then(result => {
        this.reloadCompanyArr();
        return result;
      })
    });
  }

  private reloadCompanyArr() {
    this.getAll().subscribe(arr => {
      this.allCustomerArrSubject.next(arr);
    })
  }

}
