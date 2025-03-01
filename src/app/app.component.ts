import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { filter, map, Observable, startWith } from 'rxjs';
import { SidebarService } from './core/services/sidebar.service';
import { EmployeeService } from './core/services/employee.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    CommonModule,
    FormsModule,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ric-hms';
  isLoginPage$: Observable<boolean>;
  private router = inject(Router);
  sidebarService = inject(SidebarService);
  isDrawerOpen = signal(false);
  private emplyeeService = inject(EmployeeService);
  private titleService = inject(Title);
  private route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.sidebarService.isDrawerOpen$.subscribe((state: boolean) =>
      this.isDrawerOpen.set(state)
    );

    this.route.data.subscribe((data) => {
      if (data['title']) {
        this.titleService.setTitle(data['title']);
        console.log('Page Title:', data['title']);
      }
    });

    // this.emplyeeService.setRegisteredEmpID(null)
  }

  topMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/' },
    {
      label: 'Projects',
      icon: 'pi pi-folder',
      items: [
        {
          label: 'Active Projects',
          icon: 'pi pi-play',
          routerLink: '/projects/active',
        },
        {
          label: 'Archived Projects',
          icon: 'pi pi-archive',
          routerLink: '/projects/archived',
        },
      ],
    },
    { label: 'Teams', icon: 'pi pi-users', routerLink: '/teams' },
    { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  logout() {
    console.log('User logged out');
  }

  checked: boolean = false;
  toggleTheme() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }

  constructor() {
    this.isLoginPage$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.isLoginRoute()),
      startWith(this.isLoginRoute())
    );
  }

  private isLoginRoute(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }
}
