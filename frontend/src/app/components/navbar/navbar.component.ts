import { Component, EventEmitter, Output } from '@angular/core';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';
import { I18nService } from '../../shared/i18n.pipe';

@Component({
  selector: 'app-navbar',
  imports: [LanguageSelectorComponent, I18nService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
