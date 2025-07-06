import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyManagementComponent } from './company-management.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CompanyManagementComponent', () => {
  let component: CompanyManagementComponent;
  let fixture: ComponentFixture<CompanyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyManagementComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
            {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: 'test-id' },
              paramMap: {
                get: () => 'test-id'
              }
            },
            paramMap: of(new Map().set('id', 'test-id'))
          }
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
