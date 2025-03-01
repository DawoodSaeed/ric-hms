import { Component, inject } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  imports: [BreadcrumbModule, CommonModule, RouterLink],
})
export class BreadcrumbComponent {
  private breadcrumbService = inject(BreadcrumbService);
  breadcrumbs$ = this.breadcrumbService.breadcrumbs$;

  constructor() {}
}
