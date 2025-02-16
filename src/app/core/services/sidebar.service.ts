import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private sideBarState = new BehaviorSubject<boolean>(false);
  isDrawerOpen$ = this.sideBarState.asObservable();

  constructor() {}
  toggleDrawer(state: boolean) {
    this.sideBarState.next(state);
  }
}
