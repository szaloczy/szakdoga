import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LanguageSelectorComponent } from "../../shared/language-selector/language-selector.component";

@Component({
  selector: 'app-main-layout',
  imports: [
    SidebarComponent,
    NavbarComponent,
    RouterOutlet,
],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  active: string = 'home';

  setActive(menu: string) {
    this.active = menu;
    // router.navigate, ha szeretnéd dinamikusan váltani az oldalt is
  }

  logout() {}
}
