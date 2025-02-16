import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-sidebar bg-white " [class.open]="visible">
      <div class="sidebar-content">
        <button class="close-button" (click)="closeSidebar()">×</button>
        <ng-content></ng-content>
      </div>
    </div>
    <div class="overlay" *ngIf="visible" (click)="closeSidebar()"></div>
  `,
  styleUrls: ['./custom-sidebar.component.scss'],
})
export class CustomSidebarComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  closeSidebar() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
