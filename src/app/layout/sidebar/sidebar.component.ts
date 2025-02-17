import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { InputText } from 'primeng/inputtext';
import { Drawer } from 'primeng/drawer';
import { Router, RouterModule } from '@angular/router';
import { ToggleButton } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { StyleClass } from 'primeng/styleclass';
import { expand } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
@Component({
  selector: 'app-sidebar',

  imports: [
    CommonModule,
    PanelMenuModule,
    MenuModule,
    ButtonModule,
    AvatarModule,
    BadgeModule,
    Drawer,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  sideBarTabs: any[] = [];
  menuExpanded: boolean = false;
  // Variable to track the clicked menu
  clickedMenuIndex: number | null = null;
  sidebarService = inject(SidebarService);
  constructor(private cdRef: ChangeDetectorRef) {}
  // Method to handle the click event
  onMenuClick(index: number) {
    this.clickedMenuIndex = index;
    console.log(this.clickedMenuIndex);
  }
  ngOnInit(): void {
    this.sidebarService.isDrawerOpen$.subscribe(
      (state: boolean) => (this.isDrawerOpen = state)
    );
    this.sideBarTabs = [
      {
        label: 'Admin & HR',
        icon: 'fas fa-users-cog blue',
        expanded: false, // Track expanded state
        items: [{ label: 'Employee Registry', icon: 'pi pi-circle-on' },{ label: 'Add Employee', icon: 'pi pi-circle-on',route:'/admin/addEmployee' }],
        
        // command:()=>{
        //   alert('clicked')
        // }
      },
      {
        label: 'Alpha',

        icon: 'pi pi-desktop',
        expanded: false, // Track expanded state
        items: [
          { label: 'Phone', icon: 'pi pi-circle-on' },
          { label: 'Desktop', icon: 'pi pi-circle-on' },
          { label: 'Tablet', icon: 'pi pi-circle-on' },
        ],
      },
    ];
  }
  title = 'ric';
  isDrawerOpen = true;
  toggleMenu(label: string) {
    console.log('zic ', this.sideBarTabs);
    this.sideBarTabs.forEach((tab) => {
      console.log('tab.expanded ', tab.expanded);
      if (tab.label !== label) {
        tab.expanded = false;
      }
    });
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

  sideMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/' },
    {
      label: 'Management',
      icon: 'pi pi-cog',
      items: [
        { label: 'Users', icon: 'pi pi-user', routerLink: '/management/users' },
        { label: 'Roles', icon: 'pi pi-lock', routerLink: '/management/roles' },
        {
          label: 'Permissions',
          icon: 'pi pi-shield',
          routerLink: '/management/permissions',
        },
      ],
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-bar',
      items: [
        { label: 'Sales', icon: 'pi pi-dollar', routerLink: '/reports/sales' },
        {
          label: 'Analytics',
          icon: 'pi pi-chart-line',
          routerLink: '/reports/analytics',
        },
      ],
    },
    { label: 'Help', icon: 'pi pi-question-circle', routerLink: '/help' },
  ];

  rightMenuItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user', routerLink: '/profile' },
    { label: 'Messages', icon: 'pi pi-envelope', routerLink: '/messages' },
    {
      label: 'Notifications',
      icon: 'pi pi-bell',
      routerLink: '/notifications',
    },
    { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  toggleDrawer() {
    // this.isDrawerOpen = !this.isDrawerOpen;
    this.sidebarService.toggleDrawer(!this.isDrawerOpen);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  checked: boolean = false;
  toggleTheme() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }
}
