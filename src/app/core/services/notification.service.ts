import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notyf = new Notyf({
    duration: 1500, // Notification duration in milliseconds
    ripple: false, // Disable ripple effect
    dismissible: false, // Allow user to dismiss notifications
    position: { x: 'right', y: 'top' }, // Change notification position
    types: [
      {
        type: 'info',
        background: '#17a2b8', // Custom color for info messages
        icon: {
          className: 'fas fa-info-circle', // Custom icon (FontAwesome or other)
          tagName: 'i',
        }
      },
      {
        type: 'warning',
        background: '#ffc107',
        icon: {
          className: 'fas fa-exclamation-triangle',
          tagName: 'i',
        }
      }
    ]
  });

  constructor() {}

  showSuccess(message: string) {
    this.notyf.success({
      message,
      duration: 4000,
      dismissible: true
    });
  }

  showError(message: string) {
    this.notyf.error({
      message,
      duration: 6000,
      dismissible: true
    });
  }

  showInfo(message: string) {
    this.notyf.open({
      type: 'info',
      message
    });
  }

  showWarning(message: string) {
    this.notyf.open({
      type: 'warning',
      message
    });
  }
}
