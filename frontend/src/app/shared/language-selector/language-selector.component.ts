import { Component, inject } from '@angular/core';
import { I18nService } from '../i18n.pipe';

@Component({
  selector: 'app-language-selector',
  imports: [],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {
  private readonly i18nService = inject(I18nService);
  
  languages = [
    { code: 'hu', name: 'Magyar', flag: 'flags/hu.png' },
    { code: 'en', name: 'English', flag: 'flags/en.png' }
  ];
  currentLangIndex = 0;

  constructor() {
    const currentLangCode = this.i18nService.getLanguage();
    this.currentLangIndex = this.languages.findIndex(lang => lang.code === currentLangCode);
  }

  triggerLanguageChange(newLang: string) {
    this.i18nService.switchLanguage(newLang);
  }

}
