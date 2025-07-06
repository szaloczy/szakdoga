import { TestBed } from '@angular/core/testing';
import { InternshipService } from './internship.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('InternshipService', () => {
  let service: InternshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(InternshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
