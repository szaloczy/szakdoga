import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AdminStatisticsComponent } from './admin-statistics.component';
import { AuthService } from '../../services/auth.service';
import { StatisticsService } from '../../services/statistics.service';
import { ToastService } from '../../services/toast.service';
import { I18nService } from '../../shared/i18n.pipe';
import { AdminStatistics, Language } from '../../../types';

describe('AdminStatisticsComponent', () => {
  let component: AdminStatisticsComponent;
  let fixture: ComponentFixture<AdminStatisticsComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStatisticsService: jasmine.SpyObj<StatisticsService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockI18nService: jasmine.SpyObj<I18nService>;

  const mockStatistics: AdminStatistics = {
    users: { total: 100, students: 60, mentors: 30, admins: 10 },
    internships: { total: 50, approved: 30, pending: 10, completed: 10 },
    hours: { total: 1000, approved: 800, pending: 150, rejected: 50 },
    companies: { total: 20, active: 15 },
    documents: { total: 200, approved: 150, pending: 30, rejected: 20 }
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['adminAccess']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockStatisticsService = jasmine.createSpyObj('StatisticsService', ['getAdminStatistics']);
    mockToastService = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);
    mockI18nService = jasmine.createSpyObj('I18nService', ['transform', 'getLanguage']);

    await TestBed.configureTestingModule({
      imports: [AdminStatisticsComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: StatisticsService, useValue: mockStatisticsService },
        { provide: ToastService, useValue: mockToastService },
        { provide: I18nService, useValue: mockI18nService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminStatisticsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load statistics if user has admin access', () => {
      mockAuthService.adminAccess.and.returnValue(true);
      mockStatisticsService.getAdminStatistics.and.returnValue(of(mockStatistics));
      mockI18nService.transform.and.returnValue('Statistics loaded');

      component.ngOnInit();

      expect(mockAuthService.adminAccess).toHaveBeenCalled();
      expect(mockStatisticsService.getAdminStatistics).toHaveBeenCalled();
    });

    it('should redirect to dashboard if user does not have admin access', () => {
      mockAuthService.adminAccess.and.returnValue(false);

      component.ngOnInit();

      expect(mockAuthService.adminAccess).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(mockStatisticsService.getAdminStatistics).not.toHaveBeenCalled();
    });
  });

  describe('loadStatistics', () => {
    it('should load statistics successfully', () => {
      mockStatisticsService.getAdminStatistics.and.returnValue(of(mockStatistics));
      mockI18nService.transform.and.returnValue('Statistics loaded');

      component.loadStatistics();

      expect(component.isLoading).toBe(false);
      expect(component.statistics).toEqual(mockStatistics);
      expect(mockToastService.showSuccess).toHaveBeenCalledWith('Statistics loaded');
    });

    it('should handle error when loading statistics fails', () => {
      const error = new Error('Failed to load');
      mockStatisticsService.getAdminStatistics.and.returnValue(throwError(() => error));
      mockI18nService.transform.and.returnValue('Loading error');

      component.loadStatistics();

      expect(component.isLoading).toBe(false);
      expect(mockToastService.showError).toHaveBeenCalledWith('Loading error');
    });

    it('should set isLoading to true while loading', () => {
      mockStatisticsService.getAdminStatistics.and.returnValue(of(mockStatistics));
      mockI18nService.transform.and.returnValue('Statistics loaded');

      component.isLoading = false;
      component.loadStatistics();

      expect(component.isLoading).toBe(false); // After subscription completes
    });
  });

  describe('formatDuration', () => {
    it('should format hours correctly in Hungarian', () => {
      mockI18nService.getLanguage.and.returnValue(Language.HU);

      expect(component.formatDuration(5)).toBe('5ó');
      expect(component.formatDuration(5.5)).toBe('5ó 30p');
      expect(component.formatDuration(10.25)).toBe('10ó 15p');
    });

    it('should format hours correctly in English', () => {
      mockI18nService.getLanguage.and.returnValue(Language.EN);

      expect(component.formatDuration(5)).toBe('5h');
      expect(component.formatDuration(5.5)).toBe('5h 30m');
      expect(component.formatDuration(10.25)).toBe('10h 15m');
    });
  });

  describe('goBack', () => {
    it('should navigate to admin page', () => {
      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
    });
  });

  describe('calculation methods', () => {
    beforeEach(() => {
      component.statistics = mockStatistics;
    });

    it('should calculate completion rate correctly', () => {
      const rate = component.getCompletionRate();
      expect(rate).toBe(20); // 10/50 * 100
    });

    it('should return 0 for completion rate when total is 0', () => {
      component.statistics.internships.total = 0;
      const rate = component.getCompletionRate();
      expect(rate).toBe(0);
    });

    it('should calculate hours approval rate correctly', () => {
      const rate = component.getHoursApprovalRate();
      expect(rate).toBe(80); // 800/1000 * 100
    });

    it('should return 0 for hours approval rate when total is 0', () => {
      component.statistics.hours.total = 0;
      const rate = component.getHoursApprovalRate();
      expect(rate).toBe(0);
    });

    it('should calculate average hours per student correctly', () => {
      const avg = component.getAvgHoursPerStudent();
      expect(avg).toBeCloseTo(16.67, 2); // 1000/60
    });

    it('should return 0 for average hours when students count is 0', () => {
      component.statistics.users.students = 0;
      const avg = component.getAvgHoursPerStudent();
      expect(avg).toBe(0);
    });

    it('should calculate active companies rate correctly', () => {
      const rate = component.getActiveCompaniesRate();
      expect(rate).toBe(75); // 15/20 * 100
    });

    it('should return 0 for active companies rate when total is 0', () => {
      component.statistics.companies.total = 0;
      const rate = component.getActiveCompaniesRate();
      expect(rate).toBe(0);
    });
  });

  describe('exportStatistics', () => {
    it('should generate and download CSV file', () => {
      component.statistics = mockStatistics;
      mockI18nService.transform.and.returnValue('Statistics exported');
      
      spyOn(window.URL, 'createObjectURL').and.returnValue('blob:mock-url');
      spyOn(window.URL, 'revokeObjectURL');
      const mockAnchor = document.createElement('a');
      spyOn(document, 'createElement').and.returnValue(mockAnchor);
      spyOn(mockAnchor, 'click');

      component.exportStatistics();

      expect(mockToastService.showSuccess).toHaveBeenCalledWith('Statistics exported');
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });
});
