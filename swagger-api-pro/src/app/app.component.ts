import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'swagger-api-pro';
  userName: string = '';
  userId: string = '';

  activeMenu: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // ✅ Get user info from sessionStorage
    this.userName = sessionStorage.getItem('uname') || '';
    this.userId = sessionStorage.getItem('userId') || '';
  }

  toggleSubMenu(menu: string) {
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }

  navigateTo(path: string) {
    this.activeMenu = null;
    this.router.navigate([path]);
  }
}
