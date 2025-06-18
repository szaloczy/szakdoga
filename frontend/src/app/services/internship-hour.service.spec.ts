import { TestBed } from '@angular/core/testing';

import { InternshipHourService } from './internship-hour.service';

describe('InternshipHourService', () => {
  let service: InternshipHourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternshipHourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
