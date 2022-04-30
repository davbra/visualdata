import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private customerIdArrSubject: BehaviorSubject<string> = new BehaviorSubject(null);
  private searchSubject: BehaviorSubject<string> = new BehaviorSubject(null);

  get customerIdArrObserv(): Observable<string> {
    return this.customerIdArrSubject.asObservable();
  }

  get searchObserv(): Observable<string> {
    return this.searchSubject.asObservable();
  }

  constructor() { }

  public setCustomerIdArr(arr: string) {
    this.customerIdArrSubject.next(arr);
  }

  public setSearch(text: string) {
    this.searchSubject.next(text);
  }
}
