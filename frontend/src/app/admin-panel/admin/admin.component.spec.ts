import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
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

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
