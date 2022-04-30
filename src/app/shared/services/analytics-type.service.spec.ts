import { TestBed } from '@angular/core/testing';

import { AnalyticsTypeService } from './analytics-type.service';

describe('AnalyticsTypeService', () => {
  let service: AnalyticsTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
