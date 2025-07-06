import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternshipManagementComponent } from './internship-management.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('InternshipManagementComponent', () => {
  let component: InternshipManagementComponent;
  let fixture: ComponentFixture<InternshipManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipManagementComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { roomId: 'test-room-id' },
              paramMap: {
                get: () => 'test-room-id'
              }
            },
            paramMap: of(new Map().set('roomId', 'test-room-id'))
          }
        }, // This is necessary for HTTP requests in tests
      ]
      
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
