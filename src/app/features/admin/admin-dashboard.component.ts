import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  styleUrl: './admin-dashboard.component.scss',
  templateUrl: './admin-dashboard.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {}
