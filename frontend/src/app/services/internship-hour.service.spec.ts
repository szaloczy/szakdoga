import { TestBed } from '@angular/core/testing';
import { InternshipHourService } from './internship-hour.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('InternshipHourService', () => {
  let service: InternshipHourService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(InternshipHourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
