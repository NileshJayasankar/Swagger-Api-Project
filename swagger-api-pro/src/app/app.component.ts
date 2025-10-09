import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'swagger-api-pro';

  activeMenu: string | null = null;

  constructor(private router: Router) {}

  toggleSubMenu(menu: string) {
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }

  navigateTo(path: string) {
    this.activeMenu = null;
    this.router.navigate([path]);
  }
}
