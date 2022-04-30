import { TestBed } from '@angular/core/testing';

import { AnalyticsDetailService } from './analytics-detail.service';

describe('AnalyticsDetailService', () => {
  let service: AnalyticsDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
