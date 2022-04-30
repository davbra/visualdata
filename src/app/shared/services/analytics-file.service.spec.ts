import { TestBed } from '@angular/core/testing';

import { AnalyticsFileService } from './analytics-file.service';

describe('AnalyticsFileService', () => {
  let service: AnalyticsFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
