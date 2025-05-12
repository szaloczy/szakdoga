import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSelectorComponent } from "./shared/language-selector/language-selector.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
