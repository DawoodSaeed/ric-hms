import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkMode = false;
  themeIcon = 'pi pi-moon';
  constructor() {}

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');

    if (!this.isDarkMode) {
      this.isDarkMode = true;
      this.themeIcon = 'pi pi-sun';
    } else {
      this.isDarkMode = false;
      this.themeIcon = 'pi pi-moon';
    }
  }
}
