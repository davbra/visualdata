import { AnalyticsTypeService } from './analytics-type.service';
import { CompanyService } from 'src/app/shared/services/company.service';
import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class InitialService {

  constructor(private _CompanyService: CompanyService, private _AnalyticsTypeService: AnalyticsTypeService) { }

  initial() {
    this._AnalyticsTypeService.initialRecords();
  }
}
