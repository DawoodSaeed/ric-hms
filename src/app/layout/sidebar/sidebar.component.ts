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
import { expand, Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { EmployeeService } from '../../core/services/employee.service';
import { CheckAuth, User } from '../../shared/models/auth';
@Component({
  selector: 'app-sidebar',

  imports: [
    CommonModule,
    PanelMenuModule,
    MenuModule,
    ButtonModule,
    AvatarModule,
    BadgeModule,
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
  private employeeService = inject(EmployeeService);
  sideBarTabs: any[] = [];
  menuExpanded: boolean = false;
  // Variable to track the clicked menu
  clickedMenuIndex: number | null = null;
  sidebarService = inject(SidebarService);

  user$!: Observable<CheckAuth | User | null>;
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
        label: 'Organization Building',
        icon: 'fas fa-building',
        expanded: true,
        items: [
          {
            label: 'Building',
            icon: 'fas fa-building',
            route: '/admin/organizational-building/buildings', // Adjusted route to match your routing structure
          },
          {
            label: 'Floors',
            icon: 'fas fa-layer-group',
            route: '/admin/organizational-building/floors', // Adjusted route to match your routing structure
          },
          {
            label: 'Rooms',
            icon: 'fas fa-door-open',
            route: '/admin/organizational-building/rooms', // Adjusted route to match your routing structure
          },
          {
            label: 'Beds',
            icon: 'fas fa-bed',
            route: '/admin/organizational-building/beds', // Adjusted route to match your routing structure
          },
          {
            label: 'Beds Summary',
            icon: 'fas fa-list-ul',
            route: '/admin/organizational-building/beds-summary', // Adjusted route to match your routing structure
          },
        ],
      },
      {
        label: 'Admin & HR',
        icon: 'fas fa-users-cog blue',
        expanded: false,
        items: [
          {
            label: 'Employees',
            icon: 'pi pi-circle-on',
            route: '/admin/employees',
          },
          {
            label: 'Add Employee',
            icon: 'pi pi-circle-on',
            route: '/admin/addEmployee',
          },

          {
            label: 'Roaster',
            icon: 'pi pi-calendar',
            route: '/admin/roaster',
          },
        ],
      },

      {
        label: 'User Management',
        icon: 'fas fa-users-cog blue',
        expanded: false,
        items: [
          {
            label: 'Users',
            icon: 'pi pi-users', // Changed to pi-users for a group of users
            route: '/admin/user-management/users',
          },
          {
            label: 'Roles',
            icon: 'pi pi-shield', // Changed to pi-shield, which is more relevant for roles/permissions
            route: '/admin/user-management/roles', // Consider changing this route to something more role-related
          },
        ],
      },

      {
        label: 'Organization Setup',
        icon: 'fas fa-sitemap blue',
        expanded: false,
        items: [
          {
            label: 'Location Management',
            icon: 'fas fa-map-marked-alt',
            items: [
              {
                label: 'Branches',
                icon: 'fas fa-building',
                route: '/admin/branches',
              },
              {
                label: 'Buildings',
                icon: 'fas fa-building',
                route: '/admin/buildings',
              },
              {
                label: 'Floors',
                icon: 'fas fa-layer-group',
                route: '/admin/floors',
              },
              {
                label: 'Rooms',
                icon: 'fas fa-door-open',
                route: '/admin/rooms',
              },
              { label: 'Beds', icon: 'fas fa-bed', route: '/admin/beds' },
              {
                label: 'Countries',
                icon: 'fas fa-globe',
                route: '/admin/countries',
              },
              {
                label: 'Provinces',
                icon: 'fas fa-map-marked-alt',
                route: '/admin/provinces',
              },
              {
                label: 'Districts',
                icon: 'fas fa-map-marked-alt',
                route: '/admin/districts',
              },
              { label: 'Cities', icon: 'fas fa-city', route: '/admin/cities' },
            ],
          },
          {
            label: 'Organizational Structure',
            icon: 'fas fa-network-wired',
            items: [
              {
                label: 'Designations',
                icon: 'fas fa-id-card-alt',
                route: '/admin/designations',
              },
              {
                label: 'Departments',
                icon: 'fas fa-building-columns',
                route: '/admin/departments',
              },
              {
                label: 'Department Categories',
                icon: 'fas fa-tags',
                route: '/admin/department-categories',
              },
              {
                label: 'Organization Types',
                icon: 'fas fa-sitemap',
                route: '/admin/organization-types',
              },
              {
                label: 'Job Types',
                icon: 'fas fa-briefcase',
                route: '/admin/job-types',
              },
            ],
          },
          {
            label: 'Patient Management',
            icon: 'fas fa-hospital-user',
            items: [
              {
                label: 'Patient Types',
                icon: 'fas fa-user-injured',
                route: '/admin/patient-types',
              },
              {
                label: 'Patient Check-in Status',
                icon: 'fas fa-clipboard-check',
                route: '/admin/patient-checkin-status',
              },
              {
                label: 'Check-in Types',
                icon: 'fas fa-sign-in-alt',
                route: '/admin/checkin-types',
              },
              {
                label: 'Guardian Types',
                icon: 'fas fa-user-shield',
                route: '/admin/guardian-types',
              },
              {
                label: 'Blood Groups',
                icon: 'fas fa-tint',
                route: '/admin/blood-groups',
              },
            ],
          },
          {
            label: 'Financial Management',
            icon: 'fas fa-money-bill-wave',
            items: [
              {
                label: 'Payment Methods',
                icon: 'fas fa-credit-card',
                route: '/admin/payment-methods',
              },
              {
                label: 'Discount Types',
                icon: 'fas fa-percent',
                route: '/admin/discount-types',
              },
              {
                label: 'Charges Types',
                icon: 'fas fa-file-invoice-dollar',
                route: '/admin/charges-types',
              },
              {
                label: 'Banks',
                icon: 'fas fa-university',
                route: '/admin/banks',
              },
            ],
          },
          {
            label: 'Education & Personal',
            icon: 'fas fa-graduation-cap',
            items: [
              {
                label: 'Scales',
                icon: 'fas fa-ruler-horizontal',
                route: '/admin/scales',
              },
              {
                label: 'Religions',
                icon: 'fas fa-place-of-worship',
                route: '/admin/religions',
              },
              {
                label: 'Relations',
                icon: 'fas fa-users-between-lines',
                route: '/admin/relations',
              },
              {
                label: 'Employment Status',
                icon: 'fas fa-user-tie',
                route: '/admin/employment-status',
              },
              {
                label: 'Field of Study',
                icon: 'fas fa-book-reader',
                route: '/admin/field-of-study',
              },
              {
                label: 'Faculty',
                icon: 'fas fa-chalkboard-teacher',
                route: '/admin/faculty',
              },
              {
                label: 'Education Institutes',
                icon: 'fas fa-school',
                route: '/admin/education-institutes',
              },
              {
                label: 'Education Degrees',
                icon: 'fas fa-certificate',
                route: '/admin/education-degrees',
              },
              {
                label: 'Gazzated Types',
                icon: 'fas fa-file-alt',
                route: '/admin/gazzated-types',
              },
            ],
          },
          {
            label: 'Working Sessions',
            icon: 'fas fa-clock',
            route: '/admin/working-sessions',
          },
        ],
      },
    ];

    this.user$ = this.authService.user$;
  }

  title = 'ric';
  isDrawerOpen = true;
  toggleMenu(label: string) {
    console.log('yooy');
    this.sideBarTabs.forEach((tab) => {
      if (tab.label !== label) {
        tab.expanded = false;
      }
    });
  }
  onSubTabClick() {
    console.log('subtab');
    this.employeeService.setRegisteredEmpID(null);
  }
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
  }

  checked: boolean = false;
  toggleTheme() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }
}
