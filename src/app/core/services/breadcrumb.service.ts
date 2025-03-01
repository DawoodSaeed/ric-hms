import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<
    { label: string; url: string }[]
  >([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  private updateBreadcrumbs() {
    const urlSegments = this.router.url.split('/').filter((segment) => segment);
    const breadcrumbs = [{ label: 'Home', url: '/' }]; // Home always present
    let currentPath = '';

    for (const segment of urlSegments) {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        label: this.formatBreadcrumb(segment),
        url: currentPath,
      });
    }

    this.breadcrumbsSubject.next(breadcrumbs);
  }

  private formatBreadcrumb(segment: string): string {
    return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize each word
  }
}
