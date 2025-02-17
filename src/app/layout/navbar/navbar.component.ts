import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { ToggleButton } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-navbar',
  imports: [   CommonModule,
      PanelMenuModule,
      MenuModule,
      ButtonModule,
      AvatarModule,
      Menubar,
      BadgeModule,
      InputText,
      Drawer,
      ToggleButton,
      FormsModule,
      RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
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
