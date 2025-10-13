import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelectorComponent } from './language-selector.component';
import { I18nService } from '../i18n.pipe';
import { Language } from '../../../types';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let i18nService: jasmine.SpyObj<I18nService>;

  beforeEach(async () => {
    const i18nServiceSpy = jasmine.createSpyObj('I18nService', ['getLanguage', 'switchLanguage']);

    await TestBed.configureTestingModule({
      imports: [LanguageSelectorComponent],
      providers: [
        { provide: I18nService, useValue: i18nServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    i18nService = TestBed.inject(I18nService) as jasmine.SpyObj<I18nService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct languages array', () => {
    expect(component.languages).toEqual([
      { code: 'hu', name: 'Magyar', flag: 'flags/hu.png' },
      { code: 'en', name: 'English', flag: 'flags/en.png' }
    ]);
  });

  it('should set current language index to Hungarian by default', () => {
    i18nService.getLanguage.and.returnValue(Language.HU);
    
    // Test constructor logic by creating new component
    const newFixture = TestBed.createComponent(LanguageSelectorComponent);
    const newComponent = newFixture.componentInstance;
    
    expect(newComponent.currentLangIndex).toBe(0);
  });

  it('should set current language index to English when current language is en', () => {
    i18nService.getLanguage.and.returnValue(Language.EN);
    
    // Create new component instance to test constructor
    const newFixture = TestBed.createComponent(LanguageSelectorComponent);
    const newComponent = newFixture.componentInstance;
    
    expect(newComponent.currentLangIndex).toBe(1);
  });

  it('should handle unknown language code gracefully', () => {
    i18nService.getLanguage.and.returnValue('fr' as Language); // Unknown language
    
    const newFixture = TestBed.createComponent(LanguageSelectorComponent);
    const newComponent = newFixture.componentInstance;
    
    expect(newComponent.currentLangIndex).toBe(-1);
  });

  it('should trigger language change', () => {
    const newLanguage = 'en';
    
    component.triggerLanguageChange(newLanguage);
    
    expect(i18nService.switchLanguage).toHaveBeenCalledWith(newLanguage);
  });

  it('should switch from Hungarian to English', () => {
    component.triggerLanguageChange('en');
    
    expect(i18nService.switchLanguage).toHaveBeenCalledWith('en');
  });

  it('should switch from English to Hungarian', () => {
    component.triggerLanguageChange('hu');
    
    expect(i18nService.switchLanguage).toHaveBeenCalledWith('hu');
  });

  it('should have correct flag paths', () => {
    const huLanguage = component.languages.find(lang => lang.code === 'hu');
    const enLanguage = component.languages.find(lang => lang.code === 'en');
    
    expect(huLanguage?.flag).toBe('flags/hu.png');
    expect(enLanguage?.flag).toBe('flags/en.png');
  });

  it('should have correct language names', () => {
    const huLanguage = component.languages.find(lang => lang.code === 'hu');
    const enLanguage = component.languages.find(lang => lang.code === 'en');
    
    expect(huLanguage?.name).toBe('Magyar');
    expect(enLanguage?.name).toBe('English');
  });
});
