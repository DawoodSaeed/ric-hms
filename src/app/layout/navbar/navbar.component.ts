import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Badge } from 'primeng/badge';
import { InputText } from 'primeng/inputtext';
import { Menubar } from 'primeng/menubar';
import { ToggleButton } from 'primeng/togglebutton';

@Component({
  selector: 'app-navbar',
  imports: [
    Menubar,
    InputText,
    ToggleButton,
    Badge,
    CommonModule,
    Avatar,
    FormsModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
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
}
